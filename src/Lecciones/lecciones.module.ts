import { Module } from '@nestjs/common';
import { LeccionesService } from './lecciones.service';
import { LeccionesController } from './lecciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LeccioneSchema } from './schemas/lecciones.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Lecciones', schema: LeccioneSchema }]),
  ],
  controllers: [LeccionesController],
  providers: [LeccionesService],
})
export class LeccionesModule {}
