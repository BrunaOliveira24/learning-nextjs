import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import appConfig from './app.config';
import { ConfigType } from '@nestjs/config';

@Controller('home')
export class AppController {

  constructor(
    private readonly appService: AppService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {}

  getHello(): string {
    const retorno = 'Retorno';
    return retorno;
  }
  exemplo(){
    return this.appService.solucionaExemplo();
  }
}
