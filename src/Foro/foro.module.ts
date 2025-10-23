import { Module } from '@nestjs/common';
import { ForoService } from './foro.service';
import { ForoController } from './foro.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ForoSchema } from './schemas/foro.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Foro', schema: ForoSchema }])],
  controllers: [ForoController],
  providers: [ForoService],
})
export class ForoModule {}
