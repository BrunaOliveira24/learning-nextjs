import { Injectable } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ){}
  async create(createPessoaDto: CreatePessoaDto) {
    const dadosData = {
      nome: createPessoaDto.nome,
      passwordHas:  createPessoaDto.password,
      email: createPessoaDto.email,
    };

    const novaPessoa = this.pessoaRepository.create(dadosData);
    await this.pessoaRepository.save(novaPessoa)
    return novaPessoa;
  }

  findAll() {
    return `This action returns all pessoas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pessoa`;
  }

  update(id: number, updatePessoaDto: UpdatePessoaDto) {
    return `This action updates a #${id} pessoa`;
  }

  remove(id: number) {
    return `This action removes a #${id} pessoa`;
  }
}
