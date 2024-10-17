import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './DTO/create-recado.dto';
import { UpdateRecadoDto } from './DTO/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-hader.interceptor';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';

@Controller ('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() PaginationDto: PaginationDto) {

    // return ' retorna todos os recados.';
    const recados = await this.recadosService.findAll(PaginationDto);
    return  recados;

  }
  @UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor)
  @Get(':id')
  findOnde(@Param ('id') id:string)  {
    return this.recadosService.findOne(+id);
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(@Param('id') id:number, @Body() updateRecadoDto: UpdateRecadoDto) {
   return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recadosService.remove(id);
  }
}
