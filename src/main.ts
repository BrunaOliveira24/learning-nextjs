import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntPipe } from './common/pipes/parsen-int-id.pipes';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //remove chaves que estao na DTO
    forbidNonWhitelisted: true, 
    transform: false
  }),
    new ParseIntPipe
  );

  await app.listen(3000);
}
bootstrap();
