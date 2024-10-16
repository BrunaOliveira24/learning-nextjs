import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './Entities/recados.entitiy';
import { CreateRecadoDto } from './DTO/create-recado.dto';
import { UpdateRecadoDto } from './DTO/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RecadosService {
    
    constructor(
        @InjectRepository(Recado)
        private readonly recadoRepository: Repository<Recado>,
        private readonly pessoasService: PessoasService,
    ) {}
   

    throwNotFoundError(){
       throw new NotFoundException('Recado nao encontrado');
    }
    

    async findAll(paginationDto?: PaginationDto){
      const { limit = 10, offset = 0 } = paginationDto;

      const recados = await this.recadoRepository.find({
        take: limit, // quantos registros serão exibidos (por página)
        skip: offset, // quantos registros devem ser pulados
        // relations: ['de', 'para'],
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

    async findOne(id: number){
      // const recado = this.recados.find(item => item.id === +id);
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

       //throw new HttpException('Recado nao encontrado', HttpStatus.NOT_FOUND);
        this.throwNotFoundError();
    
    }
  
// criar um novo recado com id 
     async create(createRecadoDto: CreateRecadoDto){
        const {deId, paraId} = createRecadoDto;
//Encontrar a pessoa que esta criando o recado
        const de = await this.pessoasService.findOne(deId);
//Encontrar a pessoa para quem o recado esta sendo enviado
        const para = await this.pessoasService.findOne(paraId);
        const newRecado = {

          texto: createRecadoDto.texto,
          de,
          para,
          lido: false,
          data: new Date(),
        };
          
        const recado = await this.recadoRepository.create(newRecado);
        await this.recadoRepository.save(recado);
    return {
      ...recado,
      de: {
        id: recado.de.id,
      },
      para: {
        id: recado.para.id,
      },
    };

    } 

   async update(id: number, updateRecadoDto: UpdateRecadoDto){
        
        const recado = await this.findOne(id);
      
        recado.texto = updateRecadoDto?.texto ?? recado.texto
        recado.lido = updateRecadoDto?.lido ?? recado.lido
        
        await  this.recadoRepository.save(recado);
        return recado;
        
    }
    

   async remove(id: number){

    const recado = await this.recadoRepository.findOneBy({
        id,
    });
    if (!recado) return this.throwNotFoundError();

    
    return this.recadoRepository.remove(recado);
        
    }
  

}

