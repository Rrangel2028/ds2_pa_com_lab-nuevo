import { Module } from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { ArchivosController } from './archivos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Archivo, ArchivoSchema } from './schemas/archivos.schema';
import {
  Contenidos,
  ContenidoSchema,
} from '../Contenidos/schemas/contenidos.schema';
import { Unidades, UnidadeSchema } from '../Unidades/schemas/unidades.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Archivo.name, schema: ArchivoSchema },
      { name: Contenidos.name, schema: ContenidoSchema },
      { name: Unidades.name, schema: UnidadeSchema },
    ]),
  ],
  controllers: [ArchivosController],
  providers: [ArchivosService],
})
export class ArchivosModule {}
