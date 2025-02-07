import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Recado } from './Entities/recados.entitiy';
import { CreateRecadoDto } from './DTO/create-recado.dto';
import { UpdateRecadoDto } from './DTO/update-recado.dto';
import { RecadosUtils } from './recados.utils';
import { TokenPayloadDto } from 'src/auth/DTO/token-payload.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService,
    private readonly recadoUtils: RecadosUtils,
    private readonly emailService: EmailService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const recados = await this.recadoRepository.find({
      take: limit, //quantos registros serao exibidos (por pagina)
      skip: offset, // quantos registros devem ser pulados
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recados;
  }

  async findOne(id: number) {
    // o find() Procura o primeiro item de um array que atende a uma condição e te dá esse item.
    //return this.recados.find(item => item.id === id) //para comverter o id string em number uso o +(mais) antes
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    if (recado) return recado;

    this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto, tokenPayload: TokenPayloadDto) {
    const { paraId } = createRecadoDto

    //Encontrar a pessoa que está criando o recado
    const de = await this.pessoasService.findOne(tokenPayload.sub)

    //Encontrar a pessoa para quem o recado está sendo enviado
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };

    const recado = this.recadoRepository.create(novoRecado);
    await this.recadoRepository.save(recado);

    await this.emailService.sendEmail()

    return {
      ...recado,
      de: {
        id: recado.de.id,
        nome: recado.de.nome,
      },
      para: {
        id: recado.para.id,
        nome:recado.para.nome,
      }
    }
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto, tokenPayload: TokenPayloadDto) {
    const recado = await this.findOne(id);

    if(recado.de.id !== tokenPayload.sub){
      throw new ForbiddenException('Esse recado nao e seu');
    }

    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido ?? recado.lido;
    await this.recadoRepository.save(recado);
    return recado;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const recado = await this.findOne(id);

    if(recado.de.id !== tokenPayload.sub){
      throw new ForbiddenException('Esse recado nao e seu');
    }

    if (!recado) return this.throwNotFoundError();

    return this.recadoRepository.remove(recado);
  }
}
