import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/exceptions.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Guvercinler API')
    .setDescription('Guvercinler API descriptions')
    .setVersion('1.0')
    .addTag('guvercinler')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json'
  });

  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {
      const messages = errors.map(
        error => `${Object.values(error.constraints).join(', ')}`,
      );
      return new BadRequestException(messages);
    },
  }));

  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(3000);
}
bootstrap();
