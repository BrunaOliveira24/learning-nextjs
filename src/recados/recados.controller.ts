import { Controller, Get } from '@nestjs/common';

@Controller('recados')
export class RecadosController {
    
    @Get()
    findAll(){
        return 'essa rota retorna todos os recados';

    }
  
     
    @Get('fixa/:dinamico/:id')
    findOnde(){
        return 'essa rota retorna um recado';

    }

}
