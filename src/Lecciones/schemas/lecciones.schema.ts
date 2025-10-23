import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Unidades } from '../../Unidades/schemas/unidades.schema'
import { Archivo } from '../../Archivos/schemas/archivos.schema'

@Schema({
    timestamps: true
})
export class Lecciones extends Document{
    @Prop()
    name: string;

    @Prop()
    category: string;

    @Prop()
    content: string; // <-- agregado: guarda el HTML del editor

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Unidades' }])
    Unidades: Unidades[]

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Archivo' }])
    Archivos: Archivo[]
}

export const LeccioneSchema = SchemaFactory.createForClass(Lecciones);