import { Test, TestingModule } from '@nestjs/testing';
import { EntregasController } from './entregas.controller';
import { EntregasService } from './entregas.service';

describe('EntregasController', () => {
  let controller: EntregasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntregasController],
      providers: [EntregasService],
    }).compile();

    controller = module.get<EntregasController>(EntregasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
