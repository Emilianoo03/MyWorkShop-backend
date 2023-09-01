import { IsOptional, IsString } from 'class-validator'

export class CarQueryDto {
  @IsString()
  @IsOptional()
    brand?: string

  @IsString()
  @IsOptional()
    model?: string

  @IsString()
  @IsOptional()
    color?: string

  static validFields = ['brand', 'model', 'color', 'year', 'vin', 'licensePlate', 'lastChecked', 'checkedTimes'];
}
