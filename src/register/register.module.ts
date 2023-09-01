import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from 'src/car/entities/car.entity';
import { RegisterController } from './controllers/register.controller';
import { RegisterEntity } from './entities/register.entity';
import { RegisterService } from './services/registers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegisterEntity, CarEntity])
  ],
  controllers: [RegisterController],
  providers: [RegisterService]
})
export class RegisterModule { }

