import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CarEntity } from 'src/car/entities/car.entity'
import { PageDto } from 'src/shared/dtos/page-dto'
import { PageMetaDto } from 'src/shared/dtos/page-meta-dto'
import { PageOptionsDto } from 'src/shared/dtos/page-options-dto'
import { ErrorManager } from 'src/utils/error.manager'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { CreateRegisterDto } from '../dtos/create-register.dto'
import { RegisterQueryDto } from '../dtos/register-query.dto'
import { UpdateRegisterDto } from '../dtos/update-register.dto'
import { RegisterEntity } from '../entities/register.entity'

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(RegisterEntity)
    private readonly registerRepository: Repository<RegisterEntity>,
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>
  ) { }

  async createRegister(body: CreateRegisterDto) {
    const { licensePlate } = body
    try {
      const car = await this.carRepository.findOne({ where: { licensePlate } })
      if (!car)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'El vehiculo no existe',
        })

      let data = {
        ...body,
        car,
      }
      delete data.licensePlate
      delete data.vin

      const register = await this.registerRepository.save(data)
      if (!register)
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Error al crear el registro',
        })

      car.checkedTimes += 1
      car.lastChecked = register.repairDate
      await this.carRepository.save(car)

      return register
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async getRegisters(
    pageOptionsDto: PageOptionsDto<RegisterQueryDto>
  ): Promise<PageDto<RegisterEntity>> {
    try {
      if (pageOptionsDto.filters) {
        const invalidFields = Object.keys(pageOptionsDto.filters).filter(
          (field) => !RegisterQueryDto.validFields.includes(field)
        )
        if (invalidFields.length > 0) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message: `Filtros invalidos: ${invalidFields.join(', ')}`,
          })
        }
      }
      const queryBuilder = this.registerRepository
        .createQueryBuilder('register')
        .leftJoinAndSelect('register.car', 'car')
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)

      const itemCount = await queryBuilder.getCount()

      const { entities } = await queryBuilder.getRawAndEntities()

      const pageMetaDto = new PageMetaDto({
        itemCount,
        pageOptionsDto,
        filters: pageOptionsDto.filters,
      })

      return new PageDto(entities, pageMetaDto)
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async findOne(id: string): Promise<RegisterEntity> {
    try {
      const register: RegisterEntity = await this.registerRepository.findOne({
        where: { id },
        relations: ['cars'],
      })
      if (!register)
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro el registro',
        })

      return register
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async update(
    id: string,
    body: UpdateRegisterDto
  ): Promise<UpdateResult | undefined> {
    try {
      const register: UpdateResult = await this.registerRepository.update(
        id,
        body
      )
      if (register.affected === 0)
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Error al editar el cliente.',
        })
      return register
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async deleteRegister(idRegister: string): Promise<DeleteResult | undefined> {
    try {
      const { id } = await this.registerRepository.findOne({
        where: { id: idRegister },
      })
      if (!id)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro el registro',
        })

      const register: DeleteResult = await this.registerRepository.delete({
        id,
      })
      if (register.affected === 0)
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Cliente no existente, no se pudo borrar',
        })

      return register
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }

  async getCarRegisters(id: string): Promise<any> {
    try {
      const registers = this.registerRepository.find({ where: { car: { id } } })
      if ((await registers).length == 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontraron registros para este vehiculo',
        })

      return registers
    } catch (error) {
      throw ErrorManager.createSignatureError(error)
    }
  }
}
