import { Body, Injectable } from '@nestjs/common';
import { Recado } from './Entities/recados.entitiy';

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
        return this.recados.find(item => item.id === +id);

    }
// criar um novo recado com id 
    create(body: any){
        this.lastId++;
        const id = this.lastId;
        const newRecado = {
            id,
            ...body,
        };
        this.recados.push(newRecado);

        return newRecado;
    }

    update(id: string, body: any){
        const recadoExistenteIndex = this.recados.findIndex(
            intem => intem.id === +id,
        );
        if(recadoExistenteIndex >=0){
            const recadoExistente = this.recados[recadoExistenteIndex]
        
            this.recados[recadoExistenteIndex] = {
                ... recadoExistente,
                ...body,
        
            }   
        
        };
    }

    remove(id: string){
        const recadoExistenteIndex = this.recados.findIndex(
            item => item.id === +id,
        );

        if(recadoExistenteIndex >= 0){
            this.recados.splice(recadoExistenteIndex, 1);
        }

    }
}

