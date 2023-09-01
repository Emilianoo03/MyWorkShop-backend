import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from './car/car.module';
import { ClientModule } from './client/client.module';
import { DataSourceConfig } from './config/data.source';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV.trim()}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...DataSourceConfig,
    }),
    ClientModule,
    CarModule,
    RegisterModule,
  ],
})
export class AppModule {}
