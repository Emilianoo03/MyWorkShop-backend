/* eslint-disable no-unreachable */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CarQueryDto } from 'src/car/dto/car-query-dto'
import { PageDto } from 'src/shared/dtos/page-dto'
import { PageMetaDto } from 'src/shared/dtos/page-meta-dto'
import { PageOptionsDto } from 'src/shared/dtos/page-options-dto'
import { ErrorManager } from 'src/utils/error.manager'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { ClientQueryDto } from '../dto/client-query-dto'
import { CreateClientDTO } from '../dto/create-client.dto'
import { UpdateClientDTO } from '../dto/update-client.dto'
import { ClientEntity } from '../entities/client.entity'

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) { }

  public async createUser(body: CreateClientDTO): Promise<ClientEntity> {
    try {
      const exist = await this.existClientByCI(body.clientCI)
      if (exist) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Cliente existente.' })

      const client: ClientEntity = await this.clientRepository.save(body)
      if (!client) throw new ErrorManager({ type: 'UNPROCESSABLE_ENTITY', message: 'No se pudo guardar el cliente.' })

      return client
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  public async getClients(
    pageOptionsDto: PageOptionsDto<ClientQueryDto>
  ): Promise<PageDto<ClientEntity>> {
    try {

      if (pageOptionsDto.filters) {
        const invalidFields = Object.keys(pageOptionsDto.filters).filter(field => !ClientQueryDto.validFields.includes(field));
        if (invalidFields.length > 0) {
          throw new ErrorManager({ type: "BAD_REQUEST", message: `Filtros invalidos: ${invalidFields.join(', ')}` });
        }
      }

      const queryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.cars', 'car')
        .leftJoinAndSelect('car.registers', 'register')
        .orderBy('register.updatedAt', 'DESC')
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)

      if (pageOptionsDto.filters) {
        Object.keys(pageOptionsDto.filters).forEach((key) => {
          if (pageOptionsDto.filters[key]) {
            if (typeof pageOptionsDto.filters[key] === 'string') {
              queryBuilder.andWhere(`LOWER(client.${key}) LIKE LOWER(:${key})`, { [key]: `%${pageOptionsDto.filters[key]}%` });
            } else {
              queryBuilder.andWhere(`client.${key} = :${key}`, { [key]: pageOptionsDto.filters[key] });
            }
          }
        });
      }

      const clients = await queryBuilder.getMany()

      const clientsWithLatestRegister = clients.map((client) => ({
        ...client,
        cars: client.cars.length > 0 ? [{
          ...client.cars[0],
          registers: client.cars[0].registers.length > 0 ? [client.cars[0].registers[0]] : [], // solo toma el último registro
        }] : [],
        hasMoreCars: client.cars.length > 1,
      }));

      const itemCount = await queryBuilder.getCount();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto, filters: pageOptionsDto.filters });

      return new PageDto(clientsWithLatestRegister, pageMetaDto);

    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }

  }

  public async findClient(id: string): Promise<ClientEntity> {
    try {
      const client: ClientEntity = await this.clientRepository.findOne({ where: { id }, relations: ["cars"] })
      if (!client) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se encontro el cliente' })
      return client
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  public async existClientByCI(clientCI: string) {
    try {
      const client = await this.clientRepository.findOne({ where: { clientCI } })
      return client
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  public async updateClient(
    id: string,
    body: UpdateClientDTO
  ): Promise<UpdateResult | undefined> {
    try {
      const client: UpdateResult = await this.clientRepository.update(id, body)
      if (client.affected === 0) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'Error al editar el cliente.' })

      return client
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  public async deleteClient(clientCI: string): Promise<DeleteResult | undefined> {
    try {
      const { id } = await this.clientRepository.findOne({ where: { clientCI } })
      const client: DeleteResult = await this.clientRepository.delete(id)

      if (client.affected === 0) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'Cliente no existente, no se pudo borrar' })

      return client
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }
}
