import { Module } from '@nestjs/common'
import { CarService } from './services/car.service'
import { CarController } from './controllers/car.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CarEntity } from './entities/car.entity'
import { ClientEntity } from 'src/client/entities/client.entity'
import { ClientService } from 'src/client/services/client.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([CarEntity, ClientEntity])
  ],
  controllers: [CarController],
  providers: [CarService, ClientService]
})
export class CarModule {}
