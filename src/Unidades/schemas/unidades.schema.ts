//schemas/unity.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Contenidos } from '../../Contenidos/schemas/contenidos.schema'
import { Lecciones } from '../../Lecciones/schemas/lecciones.schema'

@Schema({
    timestamps: true
})

export class Unidades extends Document{
    @Prop()
    name: string;

    @Prop()
    order: string;

    @Prop()
    category: string;

    @Prop()
    title: string;

    @Prop()
    text: string; 
    
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Contenidos' }])
    Contenidos: Contenidos[]

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecciones' }])
    Lecciones: Lecciones[]
}

export const UnidadeSchema = SchemaFactory.createForClass(Unidades);