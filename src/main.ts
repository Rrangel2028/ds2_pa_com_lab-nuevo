import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors();

  // Servir el frontend estático (carpeta /public)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Servir la carpeta uploads públicamente en /uploads
  // (permite enlaces como /uploads/entregas/archivo.pdf)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(`Server up! Listening on port ${port}`);
}

bootstrap();
