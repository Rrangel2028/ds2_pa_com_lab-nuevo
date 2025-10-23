// ...existing code...
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Entrega } from '../../Entregas/schemas/entregas.schema';
import { Archivo } from '../../Archivos/schemas/archivos.schema';
import { Lecciones } from '../../Lecciones/schemas/lecciones.schema';
import { Unidades } from '../../Unidades/schemas/unidades.schema'; // <-- nuevo import

@Schema({
  timestamps: true,
})
export class Actividad extends Document {
  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  title: string;

  @Prop()
  link: string;

  @Prop()
  status: string;

  // relacion con entregas y archivos (ya existente)
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Entrega' }])
  entregas: Entrega[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Archivo' }])
  archivos: Archivo[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Unidades' }])
  Unidades: Unidades[];

  @Prop()
  dueDate: Date;

  @Prop()
  allowFiles: boolean;
}

export const ActividadSchema = SchemaFactory.createForClass(Actividad);
