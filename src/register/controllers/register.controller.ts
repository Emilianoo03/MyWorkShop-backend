import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateRegisterDto } from '../dtos/create-register.dto';
import { UpdateRegisterDto } from '../dtos/update-register.dto';
import { RegisterService } from '../services/registers.service';
import { RegisterEntity } from '../entities/register.entity';
import { PageDto } from 'src/shared/dtos/page-dto';
import { PageOptionsDto } from 'src/shared/dtos/page-options-dto';
import { RegisterQueryDto } from '../dtos/register-query.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Post()
  createRegister(@Body() createRegisterDto: CreateRegisterDto) {
    return this.registerService.createRegister(createRegisterDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getRegisters(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto<RegisterQueryDto>
  ): Promise<PageDto<RegisterEntity>> {
    return this.registerService.getRegisters(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.registerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegisterDto: UpdateRegisterDto) {
    return this.registerService.update(id, updateRegisterDto);
  }

  @Delete(':id')
  deleteRegister(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.registerService.deleteRegister(id);
  }

  @Get(':id/registers')
  async getCarRegisters(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.registerService.getCarRegisters(id);
  }
}
