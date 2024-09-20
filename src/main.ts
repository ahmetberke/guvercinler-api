import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  await app.listen(3000);
}
bootstrap();
