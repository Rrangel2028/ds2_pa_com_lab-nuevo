import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './schemas/archivos.schema';
import { Contenidos } from '../Contenidos/schemas/contenidos.schema';
import { Unidades } from '../Unidades/schemas/unidades.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectModel(Archivo.name) private archivoModel: Model<Archivo>,
    @InjectModel(Contenidos.name) private contenidoModel: Model<Contenidos>,
    @InjectModel(Unidades.name) private unidadModel: Model<Unidades>,
  ) {}

  // ...existing code...
  async create(
    idUnidad: string,
    createArchivoDto: CreateArchivoDto,
    file: Express.Multer.File,
  ): Promise<Archivo> {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    const filePath = path.join(uploadPath, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const fileUrl = `/uploads/${file.originalname}`;

    const createdArchivo = new this.archivoModel({
      name: createArchivoDto.name,
      title: createArchivoDto.description,
      route: fileUrl,
      format: file.mimetype,
      size: file.size.toString(),
      extent: path.extname(file.originalname),
    });
    const savedArchivo = await createdArchivo.save();

    // --- NUEVO: permitir que el cliente indique que NO se cree el "Contenido"
    // Compatibilidad: por defecto se crea el Contenido (comportamiento anterior).
    const rawFlag = createArchivoDto && (createArchivoDto as any).createContent;
    const createContentFlag = !(
      rawFlag !== undefined && String(rawFlag).toLowerCase() === 'false'
    );

    if (createContentFlag) {
      const newContenido = new this.contenidoModel({
        title: savedArchivo.name,
        description: createArchivoDto.description,
        archivo: savedArchivo._id,
        unidad: idUnidad,
      });
      const savedContenido = await newContenido.save();

      const unidad = await this.unidadModel.findById(idUnidad);
      if (!unidad) {
        // Si no existe la unidad revertimos (opcional) o lanzamos error
        throw new NotFoundException(
          `No se encontró la unidad con el id ${idUnidad}`,
        );
      }
      unidad.Contenidos.push(savedContenido.id);
      await unidad.save();
    }

    return savedArchivo;
  }
  // ...existing code...

  async findAll(): Promise<Archivo[]> {
    return this.archivoModel
      .find()
      .populate('entregas')
      .populate('actividades')
      .populate('lecciones')
      .exec();
  }

  async findOne(id: string): Promise<Archivo | null> {
    return this.archivoModel
      .findById(id)
      .populate('entregas')
      .populate('actividades')
      .populate('lecciones')
      .exec();
  }

  async findArchivosEntrega(userId: string): Promise<Archivo | null> {
    return this.archivoModel.findById(userId).populate('entregas').exec();
  }

  async findArchivosActividad(userId: string): Promise<Archivo | null> {
    return this.archivoModel.findById(userId).populate('actividades').exec();
  }

  async findArchivosLecciones(userId: string): Promise<Archivo | null> {
    return this.archivoModel.findById(userId).populate('lecciones').exec();
  }

  async update(
    id: string,
    updateArchivoDto: UpdateArchivoDto,
  ): Promise<Archivo | null> {
    return this.archivoModel
      .findByIdAndUpdate(id, updateArchivoDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<any> {
    // 1. Find the Archivo document
    const archivo = await this.archivoModel.findById(id);
    if (!archivo) {
      throw new NotFoundException(`Archivo con ID "${id}" no encontrado.`);
    }

    // 2. Delete the physical file
    const filePath = path.join(process.cwd(), archivo.route);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Error al eliminar el archivo físico ${filePath}:`, err);
      // Decide if you want to stop the process or just log the error
    }

    // 3. Find and delete the associated Contenido document
    const contenido = await this.contenidoModel.findOneAndDelete({
      archivo: id,
    });

    // 4. If a Contenido was found, remove its reference from the Unidad
    if (contenido) {
      await this.unidadModel.findByIdAndUpdate(contenido.unidad, {
        $pull: { Contenidos: contenido._id },
      });
    }

    // 5. Delete the Archivo document itself
    await this.archivoModel.findByIdAndDelete(id);

    return {
      message: 'Archivo eliminado exitosamente.',
      deletedArchivoId: id,
      deletedContenidoId: contenido ? contenido._id : null,
    };
  }
}
