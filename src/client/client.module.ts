import { Module } from '@nestjs/common'
import { ClientService } from './services/client.service'
import { ClientController } from './controllers/client.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientEntity } from './entities/client.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity])
  ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}
