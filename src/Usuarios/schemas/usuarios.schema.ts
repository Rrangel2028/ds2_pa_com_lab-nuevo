import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Curso } from '../../Cursos/schemas/cursos.schema';
import { Entrega } from '../../Entregas/schemas/entregas.schema';

// Definimos los roles permitidos usando un Enum
export enum Role {
  ADMIN = 'admin',
  STUDENT = 'student',
}

@Schema({
  timestamps: true,
})
export class Usuario extends Document {
  @Prop()
  username: string;

  @Prop({ unique: [true, 'Email already exists'] })
  email: string;

  // Usamos el Enum para el tipo y establecemos un valor por defecto
  @Prop({ type: String, enum: Role, default: Role.STUDENT })
  role: Role;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }])
  cursos: Curso[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Entrega' }])
  entregas: Entrega[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
