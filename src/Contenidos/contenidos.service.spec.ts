import { Test, TestingModule } from '@nestjs/testing';
import { ContenidosService } from './contenidos.service';

describe('ContenidosService', () => {
  let service: ContenidosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContenidosService],
    }).compile();

    service = module.get<ContenidosService>(ContenidosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
