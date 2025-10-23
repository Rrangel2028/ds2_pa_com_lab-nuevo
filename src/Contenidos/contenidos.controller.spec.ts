import { Test, TestingModule } from '@nestjs/testing';
import { ContenidosController } from './contenidos.controller';
import { ContenidosService } from './contenidos.service';

describe('ContenidoController', () => {
  let controller: ContenidosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContenidosController],
      providers: [ContenidosService],
    }).compile();

    controller = module.get<ContenidosController>(ContenidosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
