
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './schemas/cursos.schema';
import { Usuario } from '../Usuarios/schemas/usuarios.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UnidadesService } from '../Unidades/unidades.service';
import { CreateUnidadesDto } from '../Unidades/dto/create-unidade.dto';
import { Unidades } from '../Unidades/schemas/unidades.schema';

@Injectable()
export class CursosService {
  constructor(
    @InjectModel(Curso.name) private cursoModel: Model<Curso>,
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    private readonly unidadesService: UnidadesService,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const createdCurso = new this.cursoModel(createCursoDto);
    return createdCurso.save();
  }

  async createUnidadForCurso(cursoId: string, createUnidadeDto: CreateUnidadesDto): Promise<Unidades> {
    const nuevaUnidad = await this.unidadesService.create(createUnidadeDto);
    if (!nuevaUnidad) {
      throw new Error('No se pudo crear la unidad.');
    }

    const cursoActualizado = await this.cursoModel.findByIdAndUpdate(
      cursoId,
      { $push: { unidades: nuevaUnidad._id } },
      { new: true },
    );

    if (!cursoActualizado) {
      await this.unidadesService.remove(nuevaUnidad._id.toString());
      throw new NotFoundException(`Curso con ID "${cursoId}" no encontrado.`);
    }

    return nuevaUnidad;
  }

  async deleteUnidadFromCurso(cursoId: string, unidadId: string): Promise<Curso> {
    const cursoActualizado = await this.cursoModel.findByIdAndUpdate(
      cursoId,
      { $pull: { unidades: unidadId } },
      { new: true },
    );

    if (!cursoActualizado) {
      throw new NotFoundException(`Curso con ID "${cursoId}" no encontrado.`);
    }

    await this.unidadesService.remove(unidadId);

    return cursoActualizado;
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoModel.find()
      .populate('inscritos')
      .populate({
        path: 'unidades',
        populate: {
          path: 'Lecciones',
          populate: {
            path: 'Archivos'
          }
        }
      })
      .exec();
  }

  async findOne(id: string): Promise<Curso | null> {
    return this.cursoModel.findById(id)
      .populate('inscritos')
      .populate({
        path: 'unidades',
        populate: {
          path: 'Lecciones',
          populate: {
            path: 'Archivos'
          }
        }
      })
      .exec();
  }

  async update(id: string, updateCursoDto: UpdateCursoDto): Promise<Curso | null> {
    return this.cursoModel.findByIdAndUpdate(id, updateCursoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Curso | null> {
    return this.cursoModel.findByIdAndDelete(id).exec();
  }

  async inscribirUsuario(cursoId: string, usuarioId: string): Promise<Curso> {
    const usuario = await this.usuarioModel.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID \"${usuarioId}\" no encontrado`);
    }

    await this.usuarioModel.findByIdAndUpdate(
      usuarioId,
      { $addToSet: { cursos: cursoId } },
      { new: true }
    );

    const cursoActualizado = await this.cursoModel.findByIdAndUpdate(
      cursoId,
      { $addToSet: { inscritos: usuarioId } },
      { new: true }
    ).populate('inscritos');

    if (!cursoActualizado) {
      throw new NotFoundException(`Curso con ID \"${cursoId}\" no encontrado`);
    }

    return cursoActualizado;
  }

  async eliminarEstudiante(cursoId: string, usuarioId: string): Promise<Curso> {
    const curso = await this.cursoModel.findById(cursoId);
    if (!curso) {
        throw new NotFoundException(`Curso con ID \"${cursoId}\" no encontrado`);
    }

    const usuario = await this.usuarioModel.findById(usuarioId);
    if (!usuario) {
        throw new NotFoundException(`Usuario con ID \"${usuarioId}\" no encontrado`);
    }

    await this.usuarioModel.findByIdAndUpdate(
      usuarioId,
      { $pull: { cursos: cursoId } },
      { new: true }
    );

    const cursoActualizado = await this.cursoModel.findByIdAndUpdate(
        cursoId,
        { $pull: { inscritos: usuarioId } },
        { new: true }
    ).populate('inscritos');

    if (!cursoActualizado) {
        throw new NotFoundException('No se pudo actualizar el curso.');
    }

    return cursoActualizado;
  }
}
