import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Usuario } from '../../Usuarios/schemas/usuarios.schema';
import { Actividad } from '../../Actividades/schemas/actividades.schema';

@Schema({ timestamps: true })
export class ArchivoMeta {
  @Prop() originalname: string;
  @Prop() filename: string;
  @Prop() path: string;
  @Prop() mimetype: string;
  @Prop() size: number;
  @Prop() uploadedAt: Date;
}

export const ArchivoMetaSchema = SchemaFactory.createForClass(ArchivoMeta);

@Schema({ timestamps: true })
export class Entrega extends Document {
  @Prop() delivery_date?: string;
  @Prop() hour?: string;
  @Prop() comment?: string;
  @Prop() grade?: number;
  @Prop() teacherComment?: string;
  @Prop() performanceLabel?: string;

  @Prop([{ type: Types.ObjectId, ref: 'Usuario' }])
  usuarios?: Usuario[];

  @Prop([{ type: Types.ObjectId, ref: 'Actividad' }])
  actividades?: Actividad[];

  @Prop({ type: [ArchivoMetaSchema], default: [] })
  archivos?: ArchivoMeta[];
}

export const EntregaSchema = SchemaFactory.createForClass(Entrega);
