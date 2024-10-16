import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './Entities/recados.entitiy';
import { CreateRecadoDto } from './DTO/create-recado.dto';
import { UpdateRecadoDto } from './DTO/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';

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
    

    async findAll(){
        const recados = await this.recadoRepository.find({
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
        const partialUpdateRecadoDto = {
            lido: updateRecadoDto?.lido,
            texto: updateRecadoDto?.texto,

        };
        const recado = await this.recadoRepository.preload({
            id,
            ...updateRecadoDto
        });
        if (!recado) return this.throwNotFoundError();
        
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

