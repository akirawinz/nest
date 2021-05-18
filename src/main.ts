import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './modules/app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  setSwagger(app);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(3000);
}

function setSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Daytechstagram')
    .setDescription('The Daytechstagram API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('authentication')
    .addTag('comment')
    .addTag('post')
    .addTag('user')
    .build();
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Daytechstagram API Docs',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, customOptions);
}

bootstrap();
