import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa> //basicamento isso é o banco de dados
  ) { }

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const dadosPessoa = {
        nome: createPessoaDto.nome,
        passwordHash: createPessoaDto.password,
        email: createPessoaDto.email
      }

      const novaPessoa = this.pessoaRepository.create(dadosPessoa)
      await this.pessoaRepository.save(novaPessoa)
      return novaPessoa
    } catch (error) {
      if (error.code === '23505') { //aqui basicamente to capturando o erro com o codigo dele, e informando que o email ja foi cadastro com um if
        throw new ConflictException('E-mail já está cadastrado')
      }

      throw error
    }

  }

  async findAll() {
    const pessoas = await this.pessoaRepository.find({
      order: {
        id: 'desc'
      },
    })

    return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const dadosPessoa = {
      nome: updatePessoaDto?.nome,  /// basicamaente esse diacho e a atualizacao do user, sendo opcional e dai ele armazena numa variavel
      passwordHash: updatePessoaDto?.password,
    }
    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa
    })

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    return this.pessoaRepository.save(pessoa)
  }

  async remove(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id
    })

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    return this.pessoaRepository.remove(pessoa)

  }
}