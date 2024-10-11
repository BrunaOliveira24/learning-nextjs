import { Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './Entities/recados.entitiy';
import { CreateRecadoDto } from './DTO/create-recado.dto';
import { UpdateRecadoDto } from './DTO/update-recado.dto';

@Injectable()
export class RecadosService {
    private lastId = 1;
    private recados: Recado[] = [
    {
        id: 1,
        texto: 'este é um recado de teste',
        de: 'Bruna',
        para: 'Kelven',
        lido: false,
        data: new Date(),
    },
    ];

    findAll(){
        return this.recados;
    }

    findOne(id: string){
       const recado = this.recados.find(item => item.id === +id);

       if (recado) return recado;

       //throw new HttpException('Recado nao encontrado', HttpStatus.NOT_FOUND);
        throw new NotFoundException('Recado nao encontrado');
    
    }
// criar um novo recado com id 
    create(createRecadoDto: CreateRecadoDto){
        this.lastId++;
        const id = this.lastId;
        const newRecado = {
            id,
            ...createRecadoDto,
            lido: false,
            data: new Date(),
        };
        this.recados.push(newRecado);

        return newRecado;
    }

    update(id: string, updateRecadoDto: UpdateRecadoDto){
        const recadoExistenteIndex = this.recados.findIndex(
            intem => intem.id === +id,
        );

        if(recadoExistenteIndex < 0){
            this.trowNotFoundError();
            
        }
        if(recadoExistenteIndex >=0){
            const recadoExistente = this.recados[recadoExistenteIndex]
        
            this.recados[recadoExistenteIndex] = {
                ... recadoExistente,
                ...updateRecadoDto,
        
            }   
        
        };
    }
    trowNotFoundError() {
        throw new Error('Method not implemented.');
    }

    remove(id: string){
        const recadoExistenteIndex = this.recados.findIndex(
            item => item.id === +id,
        );

        if(recadoExistenteIndex < 0){
            this.trowNotFoundError();
            
        }
        const recado = this.recados[recadoExistenteIndex];
        this.recados.splice(recadoExistenteIndex, 1);
        return recado;

    }
}

