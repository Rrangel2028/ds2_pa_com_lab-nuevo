import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnidadesService } from './unidades.service';
import { UnidadesController } from './unidades.controller';
import { Unidades, UnidadeSchema } from './schemas/unidades.schema';

// <-- IMPORTAR el schema de Actividad
import { Actividad, ActividadSchema } from '../Actividades/schemas/actividades.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Unidades.name, schema: UnidadeSchema },
      // registrar Actividad para poder inyectarlo en UnidadesService
      { name: Actividad.name, schema: ActividadSchema },
    ])
  ],
  controllers: [UnidadesController],
  providers: [UnidadesService],
  exports: [UnidadesService]
})
export class UnidadesModule {}