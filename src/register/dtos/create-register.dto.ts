import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import * as moment from 'moment';

export class CreateRegisterDto {
  @IsString()
  @IsNotEmpty()
  repairName: string;

  @Transform(({ value }) => { return moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate() })
  @IsDate()
  @IsNotEmpty()
  repairDate: Date;


  @IsNumber()
  @IsNotEmpty()
  mileage: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  vin: string;

  @IsString()
  @IsOptional()
  licensePlate: string;
}
