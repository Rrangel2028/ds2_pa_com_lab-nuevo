// ...existing code...
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnidadesDto } from './dto/create-unidade.dto';
import { UpdateUnidadesDto } from './dto/update-unidade.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Unidades } from './schemas/unidades.schema';
import { Contenidos } from '../Contenidos/schemas/contenidos.schema';

// <-- NUEVO: importar Actividad
import { Actividad } from '../Actividades/schemas/actividades.schema';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectModel(Unidades.name) private unidadeModel: Model<Unidades>,
    // <-- INYECTAR modelo Actividad para hacer la consulta
    @InjectModel(Actividad.name) private actividadModel: Model<Actividad>,
  ) {}

  async create(createUnidadeDto: CreateUnidadesDto): Promise<Unidades> {
    const createdUnidade = new this.unidadeModel(createUnidadeDto);
    return createdUnidade.save();
  }

  async findAll(): Promise<Unidades[]> {
    return this.unidadeModel
      .find()
      .populate('Contenidos')
      .populate('Lecciones')
      .exec();
  }

  async findOne(id: string): Promise<Unidades | null> {
    return this.unidadeModel
      .findById(id)
      .populate('Contenidos')
      .populate('Lecciones')
      .exec();
  }

  async findUnidadesContenido(id: string): Promise<any> {
    const unidad = await this.unidadeModel
      .findById(id)
      .populate({
        path: 'Contenidos',
        populate: {
          path: 'archivo',
          model: 'Archivo',
        },
      })
      .populate('Lecciones')
      .exec();

    if (!unidad) {
      throw new NotFoundException(`Unidad con ID "${id}" no encontrada`);
    }

    const archivos = unidad.Contenidos.filter((c) => c.archivo).map(
      (c: any) => ({
        _id: c.archivo._id,
        name: c.archivo.name,
        url: c.archivo.route,
        description: c.description,
      }),
    );

    const lecciones = unidad.Lecciones || [];

    // --- NUEVO: consultar actividades que referencian esta unidad
    const actividadesDocs = await this.actividadModel
      .find({ Unidades: id })
      .populate('entregas')
      .populate('archivos')
      .exec();

    const actividades = actividadesDocs.map((a: any) => ({
      _id: a._id,
      name: a.name,
      description: a.description,
      dueDate: a.dueDate || null,
      allowFiles: typeof a.allowFiles !== 'undefined' ? a.allowFiles : true,
      entregas: a.entregas || [],
      archivos: (a.archivos || []).map((f: any) => ({
        _id: f._id,
        name: f.name,
        url: f.route,
      })),
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));

    return { archivos, lecciones, actividades };
  }

  async findUnidadesLecciones(Id: string): Promise<Unidades | null> {
    return this.unidadeModel.findById(Id).populate('Lecciones').exec();
  }

  async update(
    id: string,
    updateUnidadeDto: UpdateUnidadesDto,
  ): Promise<Unidades | null> {
    return this.unidadeModel
      .findByIdAndUpdate(id, updateUnidadeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Unidades | null> {
    return this.unidadeModel.findByIdAndDelete(id).exec();
  }
}
