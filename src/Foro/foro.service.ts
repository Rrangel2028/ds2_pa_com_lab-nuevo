import { Injectable } from '@nestjs/common';
import { CreateForoDto } from './dto/create-foro.dto';
import { UpdateForoDto } from './dto/update-foro.dto';
import { Foro } from './schemas/foro.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ForoSchema } from './schemas/foro.schema';

@Injectable()
export class ForoService {
  constructor(@InjectModel(Foro.name) private foroModel: Model<Foro>) {}

  async create(createForoDto: CreateForoDto): Promise<Foro> {
    const createdForo = new this.foroModel(createForoDto);
    return createdForo.save();
  }

  async findAll(): Promise<Foro[]> {
    return this.foroModel.find().exec();
  }

  async findOne(id: string): Promise<Foro | null> {
    return this.foroModel.findById(id).exec();
  }

  async update(id: string, updateForoDto: UpdateForoDto): Promise<Foro | null> {
    return this.foroModel
      .findByIdAndUpdate(id, updateForoDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Foro | null> {
    return this.foroModel.findByIdAndDelete(id).exec();
  }
}
