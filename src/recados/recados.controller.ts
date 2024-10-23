import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './DTO/create-recado.dto';
import { UpdateRecadoDto } from './DTO/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UrlParam } from 'src/common/params/url-param.decorator';
import { RecadosUtils } from './recados.utils';



@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    private readonly recadosUtils: RecadosUtils,
  ) { }


  @Get()
  async findAll(@Query() paginationDto: PaginationDto, @UrlParam() url:string,) {
    const recados = await this.recadosService.findAll(paginationDto);
    return recados
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
  ) {
    this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  romove(@Param('id') id: number) {
    this.recadosService.remove(id);
  }
} 

