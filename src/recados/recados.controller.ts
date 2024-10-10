import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RecadosService } from './recados.service';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  findAll() {
    // return ' retorna todos os recados.';
    return this.recadosService.findAll();
  }

  @Get(':id')
  findOnde(@Param('id') id: string) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.recadosService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    this.recadosService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.recadosService.remove(id);
  }
}
