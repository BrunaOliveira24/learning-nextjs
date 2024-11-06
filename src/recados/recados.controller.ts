import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';

import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './DTO/create-recado.dto';
import { UpdateRecadoDto } from './DTO/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UrlParam } from 'src/common/params/url-param.decorator';
import { RecadosUtils } from './recados.utils';
import { AuthTokenGuard } from 'src/auth/guards/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/DTO/token-payload.dto';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';


@UseGuards(RoutePolicyGuard)
@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    private readonly recadosUtils: RecadosUtils,
  ) { }


  @Get()
  @UseGuards(RoutePolicyGuard)
  async findAll(@Query() paginationDto: PaginationDto, @UrlParam() url:string,) {
    const recados = await this.recadosService.findAll(paginationDto);
    return recados
  }

  @Get(':id')
  @SetRoutePolicy(RoutePolicies.findAllRecados)
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto,
          @TokenPayloadParam()  tokenPayload: TokenPayloadDto) {
    return this.recadosService.create(createRecadoDto,  tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    
  ) {
    this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  romove(@Param('id') id: number,
         @TokenPayloadParam() tokenPayload: TokenPayloadDto,
) {
    this.recadosService.remove(id, tokenPayload);
  }
} 

