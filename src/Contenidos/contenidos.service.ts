import { Injectable } from '@nestjs/common';
import { CreateContenidosDto } from './dto/create-contenido.dto';
import { UpdateContenidosDto } from './dto/update-contenido.dto';
import { Contenidos } from './schemas/contenidos.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ContenidoSchema } from './schemas/contenidos.schema';

@Injectable()
export class ContenidosService {
  constructor(@InjectModel(Contenidos.name) private contenidoModel: Model<Contenidos>) {}

  async create(createContenidoDto: CreateContenidosDto): Promise<Contenidos> {
    const createdContenido = new this.contenidoModel(createContenidoDto);
    return createdContenido.save();
  }

  async findAll(): Promise<Contenidos[]> {
    return this.contenidoModel.find().populate('Unidades').exec();
  }

  async findOne(id: string): Promise<Contenidos | null> {
    return this.contenidoModel.findById(id).populate('Unidades').exec();
  }

  async findContenidosUnidades(Id: string): Promise<Contenidos | null> {
    return this.contenidoModel.findById(Id).populate('Unidades').exec();
  }

  async update(id: string, UpdateContenidoDto: UpdateContenidosDto): Promise<Contenidos | null> {
    return this.contenidoModel.findByIdAndUpdate(id, UpdateContenidoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Contenidos | null> {
    return this.contenidoModel.findByIdAndDelete(id).exec()
}
}