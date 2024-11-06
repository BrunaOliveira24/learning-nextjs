import { Repository } from "typeorm";
import { PessoasService } from "./pessoas.service";
import { Pessoa } from "./entities/pessoa.entity";
import { HashingService } from "src/auth/hashing.service";
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from "@nestjs/typeorm";


describe('PessoasService', () => {
    let service: PessoasService;
    let pessoaRepository: Repository<Pessoa>
    let hashingService: HashingService;

    beforeEach(async () => {
        const module: TestingModule = await await Test.createTestingModule({
            providers: [
                PessoasService,
                {
                    provide: getRepositoryToken(Pessoa),
                    useValue: {},
                },
                {
                    provide: HashingService,
                    useValue: {},
                },
            ],
        }).compile();
            service = module.get<PessoasService>(PessoasService);
            pessoaRepository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
            hashingService = module.get<HashingService>(HashingService);
      
    });

    // Caso - Teste
    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });
  });