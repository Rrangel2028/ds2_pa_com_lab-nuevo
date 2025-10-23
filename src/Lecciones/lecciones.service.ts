import { Injectable } from '@nestjs/common';
import { CreateLeccionesDto } from './dto/create-leccione.dto';
import { UpdateLeccionesDto } from './dto/update-leccione.dto';
import { Lecciones } from './schemas/lecciones.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LeccioneSchema } from './schemas/lecciones.schema';
import { Unidades } from '../Unidades/schemas/unidades.schema'; // <-- añadir

@Injectable()
export class LeccionesService {
  // Inyectamos también el modelo de Unidades
  constructor(
    @InjectModel(Lecciones.name) private leccioneModel: Model<Lecciones>,
    @InjectModel(Unidades.name) private unidadesModel: Model<any>, // tipo any para evitar import ciclico fuerte
  ) {}

  // CREATE: guardamos la lección y actualizamos las unidades (si vienen)
  async create(createLeccioneDto: CreateLeccionesDto): Promise<Lecciones> {
    const createdLeccione = new this.leccioneModel(createLeccioneDto);
    const saved = await createdLeccione.save();

    // Si el payload incluye Unidades, añadimos la referencia en cada unidad
    try {
      const unidades =
        createLeccioneDto.Unidades || createLeccioneDto.Unidades || [];
      if (Array.isArray(unidades) && unidades.length > 0) {
        await Promise.all(
          unidades.map((unitId: string) =>
            this.unidadesModel
              .findByIdAndUpdate(
                unitId,
                { $addToSet: { Lecciones: saved._id } }, // $addToSet evita duplicados
                { new: true },
              )
              .exec(),
          ),
        );
      }
    } catch (err) {
      // En caso de fallo en actualizar unidades, lo registramos pero devolvemos la lección creada.
      // Puedes cambiar esto para revertir la creación si lo prefieres.
      console.error(
        'No se pudo actualizar Unidades con la nueva lección:',
        err,
      );
    }

    return saved;
  }

  async findAll(): Promise<Lecciones[]> {
    return this.leccioneModel
      .find()
      .populate('Unidades')
      .populate('archivos')
      .exec();
  }

  async findOne(id: string): Promise<Lecciones | null> {
    return this.leccioneModel
      .findById(id)
      .populate('Unidades')
      .populate('archivos')
      .exec();
  }

  async findLeccionesUnidades(Id: string): Promise<Lecciones | null> {
    return this.leccioneModel.findById(Id).populate('Unidades').exec();
  }

  async findLeccionesArchivo(Id: string): Promise<Lecciones | null> {
    return this.leccioneModel.findById(Id).populate('Archivos').exec();
  }

  async update(
    id: string,
    updateLeccioneDto: UpdateLeccionesDto,
  ): Promise<Lecciones | null> {
    return this.leccioneModel
      .findByIdAndUpdate(id, updateLeccioneDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Lecciones | null> {
    return this.leccioneModel.findByIdAndDelete(id).exec();
  }
}
