import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class CreateClientDTO {
  @IsNotEmpty({ message: 'Cédula de identidad requerida' })
  @Matches(/^[0-9]{7,8}[0-9]$/, { message: 'Cédula de identidad inválida' })
    clientCI: string

  @IsNotEmpty({ message: 'Nombre requerido' })
  @IsString()
    fullName: string

  @IsNotEmpty({ message: 'Número de teléfono requerido' })
  @IsString()
    phoneNumber: string

  @IsOptional()
  @IsString()
    address: string
}
