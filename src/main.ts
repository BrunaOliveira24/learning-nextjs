import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntPipe } from './common/pipes/parsen-int-id.pipes';
import appConfig from './app/config/app.config';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

appConfig(app);

  await app.listen(3000);
}
bootstrap();
