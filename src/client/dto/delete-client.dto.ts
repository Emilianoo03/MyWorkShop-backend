import { IsNotEmpty, Matches } from 'class-validator'

export class DeleteClientDTO {
  @IsNotEmpty({ message: 'Cédula de identidad requerida' })
  @Matches(/^[0-9]{7,8}[0-9]$/, { message: 'Cédula de identidad inválida' })
    clientCI: string
}
