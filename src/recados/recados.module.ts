import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { Recado } from './Entities/recados.entitiy';
import { RecadosUtils } from './recados.utils';

@Module({
  imports: [TypeOrmModule.forFeature([Recado]), 
  forwardRef(() => PessoasModule)
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: RecadosUtils, // token
      useClass: RecadosUtils, //valor a ser usado
    },
  ],
})
export class RecadosModule { }
