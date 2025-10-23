//schemas/content.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Unidades } from '../../Unidades/schemas/unidades.schema';
import { Archivo } from "../../Archivos/schemas/archivos.schema";

@Schema({
    timestamps: true
})

export class Contenidos extends Document{
    @Prop()
    title: string;

    @Prop()
    description: string; 

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Archivos' })
    archivo: Archivo;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unidades' })
    unidad: Unidades;
}

export const ContenidoSchema = SchemaFactory.createForClass(Contenidos);
