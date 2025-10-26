import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './schemas/usuarios.schema';
import { Curso } from '../Cursos/schemas/cursos.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    @InjectModel(Curso.name) private cursoModel: Model<Curso>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const createdUsuario = new this.usuarioModel(createUsuarioDto);
    return createdUsuario.save();
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ email: email }).exec();
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel
      .find()
      .populate('cursos')
      .populate('entregas')
      .exec();
  }

  async findOne(id: string): Promise<Usuario | null> {
    return this.usuarioModel
      .findById(id)
      .populate('cursos')
      .populate('entregas')
      .exec();
  }

  async findUserCursos(userId: string): Promise<Usuario | null> {
    return this.usuarioModel.findById(userId).populate('cursos').exec();
  }

  async findUserEntregas(userId: string): Promise<Usuario | null> {
    return this.usuarioModel.findById(userId).populate('entregas').exec();
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario | null> {
    return this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<Usuario | null> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    if (usuario.cursos && usuario.cursos.length > 0) {
      // CORRECT SYNTAX: No .exec() is needed here
      await this.cursoModel.updateMany(
        { _id: { $in: usuario.cursos } },
        { $pull: { inscritos: id } },
      );
    }

    return this.usuarioModel.findByIdAndDelete(id).exec();
  }
}
