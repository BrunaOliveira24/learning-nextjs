import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './Entities/recados.entitiy';
import { CreateRecadoDto } from './DTO/create-recado.dto';
import { UpdateRecadoDto } from './DTO/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
    
    constructor(
        @InjectRepository(Recado)
        private readonly recadoRepository: Repository<Recado>
    ) {}
   

    throwNotFoundError(){
       throw new NotFoundException('Recado nao encontrado');
    }
    

    async findAll(){
      const recados = await this.recadoRepository.find();
      return recados;
    }

    async findOne(id: number){
      // const recado = this.recados.find(item => item.id === +id);
        const recado = await this.recadoRepository.findOne({
            where: {
                id,
            },
        });

       if (recado) return recado;

       //throw new HttpException('Recado nao encontrado', HttpStatus.NOT_FOUND);
        this.throwNotFoundError();
    
    }
  
// criar um novo recado com id 
     async create(createRecadoDto: CreateRecadoDto){
    
        const newRecado = {
            ...createRecadoDto,
            lido: false,
            data: new Date(),
        };
        const recado = await this.recadoRepository.create(newRecado);
        return this.recadoRepository.save(recado);

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

