// src/Cursos/schemas/cursos.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Usuario } from '../../Usuarios/schemas/usuarios.schema';
import { Unidades } from '../../Unidades/schemas/unidades.schema';

@Schema({
    timestamps: true 
})
export class Curso extends Document {
    @Prop({
        required: true,
        trim: true,
    })
    nombre: string;

    @Prop({
        required: true,
        trim: true,
    })
    descripcion: string;

    @Prop()
    porcentaje: number;

    @Prop()
    fecha_inicio: Date;

    @Prop()
    fecha_fin: Date;
    
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }])
    inscritos: Usuario[];

    // Relación 1:n con Unidades
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Unidades' }])
    unidades: Unidades[];
}

export const CursoSchema = SchemaFactory.createForClass(Curso);
