//schemas/folder.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Entrega } from '../../Entregas/schemas/entregas.schema';
import { Actividad } from '../../Actividades/schemas/actividades.schema';
import { Lecciones } from '../../Lecciones/schemas/lecciones.schema';

@Schema({
  timestamps: true,
})
export class Archivo extends Document {
  @Prop()
  name: string;

  @Prop()
  format: string;

  @Prop()
  route: string;

  @Prop()
  size: string;

  @Prop()
  extent: string;

  @Prop()
  order: string;

  @Prop()
  type: string;

  @Prop()
  title: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Entrega' }])
  entregas: Entrega[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' }])
  actividades: Actividad[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecciones' }])
  lecciones: Lecciones[];
}

export const ArchivoSchema = SchemaFactory.createForClass(Archivo);
