import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import globalConfig from 'src/global-config/global.config';
import { ConfigType } from '@nestjs/config';

@Controller('home')
export class AppController {

  constructor(
    private readonly appService: AppService,
    @Inject(globalConfig.KEY)
    private readonly globalConfiguration: ConfigType<typeof globalConfig>,
  ) {}

  getHello(): string {
    const retorno = 'Retorno';
    return retorno;
  }
  exemplo(){
    return this.appService.solucionaExemplo();
  }
}
