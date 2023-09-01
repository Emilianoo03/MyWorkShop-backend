import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common'
import { PageDto } from 'src/shared/dtos/page-dto'
import { PageOptionsDto } from 'src/shared/dtos/page-options-dto'
import { ClientQueryDto } from '../dto/client-query-dto'
import { CreateClientDTO } from '../dto/create-client.dto'
import { UpdateClientDTO } from '../dto/update-client.dto'
import { ClientEntity } from '../entities/client.entity'
import { ClientService } from '../services/client.service'
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Post()
  createUser(@Body() createClientDTO: CreateClientDTO) {
    return this.clientService.createUser(createClientDTO)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getClients(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto<ClientQueryDto>
  ): Promise<PageDto<ClientEntity>> {
    return await this.clientService.getClients(pageOptionsDto)
  }

  @Get(':id')
  findClientByCI(@Param('id') id: string) {
    return this.clientService.findClient(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDTO: UpdateClientDTO) {
    return this.clientService.updateClient(id, updateClientDTO)
  }

  @Delete(':clientCI')
  remove(@Param('clientCI') clientCI: string) {
    return this.clientService.deleteClient(clientCI)
  }
}
