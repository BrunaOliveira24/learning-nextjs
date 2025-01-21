import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { Recado } from './Entities/recados.entitiy';
import { RecadosUtils } from './recados.utils';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ConfigModule.forFeature(recadosConfig)
    TypeOrmModule.forFeature([Recado]), 
  forwardRef(() => PessoasModule),
  EmailModule,
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
  RecadosUtils,
  ],
})
export class RecadosModule { }
