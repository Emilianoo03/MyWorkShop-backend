import { IsOptional, IsString } from 'class-validator'

export class ClientQueryDto {
  @IsString()
  @IsOptional()
  fullName?: string

  @IsString()
  @IsOptional()
  clientCI?: string

  @IsString()
  @IsOptional()
  phoneNumber?: string


  @IsString()
  @IsOptional()
  address?: string

  static validFields = ['fullName', 'clientCI', 'fullName', 'phoneNumber', 'address'];
}
