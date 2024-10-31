import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/DTO/token-payload.dto';


@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }
 
  @UseGuards(AuthTokenGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.pessoasService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, 
        @Body() updatePessoaDto: UpdatePessoaDto,
        @TokenPayloadParam() tokenPayLoad: TokenPayloadDto,
          ) {
    return this.pessoasService.update(+id, updatePessoaDto, tokenPayLoad);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string,
         @TokenPayloadParam() tokenPayLoad: TokenPayloadDto,) {
    return this.pessoasService.remove(+id, tokenPayLoad);
  }
}
