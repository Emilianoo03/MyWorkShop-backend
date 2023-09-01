import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientService } from 'src/client/services/client.service'
import { PageDto } from 'src/shared/dtos/page-dto'
import { PageMetaDto } from 'src/shared/dtos/page-meta-dto'
import { PageOptionsDto } from 'src/shared/dtos/page-options-dto'
import { ErrorManager } from 'src/utils/error.manager'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { CarQueryDto } from '../dto/car-query-dto'
import { CreateCarDTO } from '../dto/create-car.dto'
import { UpdateCarDTO } from '../dto/update-car.dto'
import { CarEntity } from '../entities/car.entity'

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
    private readonly clientService: ClientService
  ) { }

  async createCar(body: CreateCarDTO): Promise<CarEntity> {
    try {
      const existClient = await this.clientService.existClientByCI(body.clientCI)

      if (!existClient) throw new ErrorManager({ type: 'NOT_FOUND', message: 'El cliente no esta regitrado' })

      const existVIN = await this.checkVIN(body.vin)
      if (existVIN) throw new ErrorManager({ type: 'CONFLICT', message: 'Ya existe un vehiculo registrado con el mismo VIN' })

      let data = {
        ...body,
        client: existClient
      }
      delete data.clientCI

      const car: CarEntity = await this.carRepository.save(data)
      if (!car) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error al crear el vehiculo' })

      return car
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async checkVIN(vin: String): Promise<Boolean> {
    const checkVIN = await this.carRepository
      .createQueryBuilder('car')
      .where({ vin })
      .getOne()
    return !!checkVIN
  }

  async getCars(
    pageOptionsDto: PageOptionsDto<CarQueryDto>
  ): Promise<PageDto<CarEntity>> {
    try {

      if (pageOptionsDto.filters) {
        const invalidFields = Object.keys(pageOptionsDto.filters).filter(field => !CarQueryDto.validFields.includes(field));
        if (invalidFields.length > 0) {
          throw new ErrorManager({ type: "BAD_REQUEST", message: `Filtros invalidos: ${invalidFields.join(', ')}` });
        }
      }

      const queryBuilder = this.carRepository.createQueryBuilder("car");
      queryBuilder
        .orderBy("car.createdAt", pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .innerJoinAndSelect("car.client", "client");

      if (pageOptionsDto.filters) {
        Object.keys(pageOptionsDto.filters).forEach((key) => {
          if (pageOptionsDto.filters[key]) {
            if (typeof pageOptionsDto.filters[key] === 'string') {
              queryBuilder.andWhere(`LOWER(car.${key}) LIKE LOWER(:${key})`, { [key]: `%${pageOptionsDto.filters[key]}%` });
            } else {
              queryBuilder.andWhere(`car.${key} = :${key}`, { [key]: pageOptionsDto.filters[key] });
            }
          }
        });
      }

      const itemCount = await queryBuilder.getCount();

      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto, filters: pageOptionsDto.filters });

      return new PageDto(entities, pageMetaDto);

    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async findOneCar(id: string): Promise<CarEntity> {
    try {

      const car = await this.carRepository.findOne({ where: { id }, relations: ["client"] })
      if (!car) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Vehiculo no encontrado' })

      return car
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async updateCar(id: string, body: UpdateCarDTO): Promise<UpdateResult> {
    try {

      const exist = await this.carRepository.findOne({ where: { id } })
      if (!exist) throw new ErrorManager({ type: 'NOT_FOUND', message: 'No se ha encontrado el vehiculo' })

      const car = await this.carRepository.update(id, body)
      if (!car) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'Error al editar el vehiculo' })

      return car
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async deleteCar(id: string): Promise<DeleteResult> {
    try {
      const exist = await this.carRepository.findOne({ where: { id } })
      if (!exist) throw new ErrorManager({ type: 'NOT_FOUND', message: 'No se ha encontrado el vehiculo' })

      const car: DeleteResult = await this.carRepository.delete(id)
      if (car.affected === 0) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error del servidor' })
      
      return car
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }
}
