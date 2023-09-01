import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRegisterDto {
  @IsString()
  @IsOptional()
  repairName?: string;

  @IsDate()
  @IsOptional()
  repairDate?: Date;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  mileage?: number;

  @Transform(({value}) => Number(value))
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
