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
    private readonly pessoaRepository: Repository<Pessoa>,
  ){}

  throwNotFoundError(){
    throw new NotFoundException('Pessoa nao encontrada');
 }

  async create(createPessoaDto: CreatePessoaDto) {
    
    try{
    const dadosPessoa = {
      nome: createPessoaDto.nome,
      passwordHash:  createPessoaDto.password,
      email: createPessoaDto.email,
    };

    const novaPessoa = this.pessoaRepository.create(dadosPessoa);
    await this.pessoaRepository.save(novaPessoa)
    return novaPessoa;
  } catch (error) {
      if (error.code ==='23505'){
        throw new ConflictException('E-mail ja esta cadastrado.');
      }

      throw error;
  
    }

  }


  findAll() {
    return `This action returns all pessoas`;
  }

  

  async findOne(id: number){
    // const recado = this.recados.find(item => item.id === +id);
       const pessoa = await this.pessoaRepository.findOneBy({
        id,
       });

     if (!pessoa){
      throw new NotFoundException('Pessoa nao encontrada');
     }
     return pessoa;
  }


  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const dadosPessoa = {
      nome: updatePessoaDto?.nome,
      passwordHash: updatePessoaDto.password,
    };

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
    });

    if(!pessoa){
      throw new NotFoundException('Pessoa não encontrada');
    }
      return this.pessoaRepository.save(pessoa);
  }



 async remove(id: number) {
   const person = await this.pessoaRepository.findOneBy({
    id
   })
   if(!person){
    throw new NotFoundException('Pessoa nao encontrada');
   }

   return this.pessoaRepository.remove(person);
  }
}
