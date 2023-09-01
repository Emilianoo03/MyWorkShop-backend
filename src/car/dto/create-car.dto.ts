import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class CreateCarDTO {

  @IsOptional()
  @IsString()
  image: string = ""

  @IsNotEmpty()
  @IsString()
  vin: string

  @IsNotEmpty()
  @IsString()
  brand: string

  @IsNotEmpty()
  @IsString()
  model: string

  @IsNotEmpty()
  @IsString()
  color: string

  @IsNotEmpty()
  @IsString()
  licensePlate: string

  @IsNotEmpty()
  @IsString()
  year: string

  @IsNotEmpty({ message: 'Cédula de identidad requerida' })
  @Matches(/^[0-9]{7,8}[0-9]$/, { message: 'Cédula de identidad inválida' })
  clientCI: string
}
