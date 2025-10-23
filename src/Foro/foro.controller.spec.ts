import { Test, TestingModule } from '@nestjs/testing';
import { ForoController } from './foro.controller';
import { ForoService } from './foro.service';

describe('ForoController', () => {
  let controller: ForoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForoController],
      providers: [ForoService],
    }).compile();

    controller = module.get<ForoController>(ForoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
