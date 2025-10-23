//schemas/answer.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Respuesta extends Document{
    @Prop()
    message: string;  

    @Prop()
    send_date: string;  
}
export const RespuestaSchema = SchemaFactory.createForClass(Respuesta);