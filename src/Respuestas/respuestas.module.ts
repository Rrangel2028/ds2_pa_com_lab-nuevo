import { Module } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { RespuestasController } from './respuestas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RespuestaSchema } from './schemas/respuestas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Respuesta', schema: RespuestaSchema }]),
  ],
  controllers: [RespuestasController],
  providers: [RespuestasService],
})
export class RespuestasModule {}
