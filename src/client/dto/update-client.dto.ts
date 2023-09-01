import { IsOptional, IsString, Matches } from 'class-validator'

export class UpdateClientDTO {
  @IsOptional()
  @Matches(/^[0-9]{7,8}[0-9]$/, { message: 'Cédula de identidad inválida' })
  clientCI: string

  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsOptional()
  @IsString()
  phoneNumber: string

  @IsOptional()
  @IsString()
  address: string
}
