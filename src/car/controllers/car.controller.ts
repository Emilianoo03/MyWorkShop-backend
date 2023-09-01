/* eslint-disable no-useless-constructor */
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseInterceptors, ValidationPipe } from '@nestjs/common'
import { PageDto } from 'src/shared/dtos/page-dto'
import { PageOptionsDto } from 'src/shared/dtos/page-options-dto'
import { CreateCarDTO } from '../dto/create-car.dto'
import { CarQueryDto } from '../dto/car-query-dto'
import { UpdateCarDTO } from '../dto/update-car.dto'
import { CarEntity } from '../entities/car.entity'
import { CarService } from '../services/car.service'

@Controller('car')
@UseInterceptors(ClassSerializerInterceptor)
export class CarController {
  constructor(private readonly carService: CarService) { }

  @Post()
  create(@Body() createCarDTO: CreateCarDTO) {
    return this.carService.createCar(createCarDTO)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCars(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto<CarQueryDto>
  ): Promise<PageDto<CarEntity>> {
    return this.carService.getCars(pageOptionsDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOneCar(id)
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateCarDTO: UpdateCarDTO) {
    return this.carService.updateCar(id, updateCarDTO)
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.carService.deleteCar(id)
  }
}
