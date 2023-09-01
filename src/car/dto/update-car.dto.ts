import { PartialType } from '@nestjs/mapped-types'
import { CreateCarDTO } from './create-car.dto'
import { IsOptional, IsString, Matches } from 'class-validator'

export class UpdateCarDTO extends PartialType(CreateCarDTO) {
    @IsOptional()
    @IsString()
      vin: string

    @IsOptional()
    @IsString()
      brand: string

    @IsOptional()
    @IsString()
      model: string

    @IsOptional()
    @IsString()
      color: string

    @IsOptional()
    @Matches(/^[0-9]{7,8}[0-9]$/, { message: 'Cédula de identidad inválida' })
      clientCI: string
}
