import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //remove chaves que estao na DTO
    forbidNonWhitelisted: true, 
    transform: false
  }),
  new ParseIntPipe(),
);
  await app.listen(3000);
}
bootstrap();
