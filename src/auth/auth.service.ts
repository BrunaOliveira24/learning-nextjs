import { Injectable, UnauthorizedException } from "@nestjs/common";
import { loginDto } from "./DTO/login.dto";
import { Repository } from "typeorm";
import { Pessoa } from "src/pessoas/entities/pessoa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing.service";


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoasRepository: Repository <Pessoa>,
        private readonly hashingService: HashingService,
    ){}
        

    async login(loginDto: loginDto){
        let passwordIsValid = false;
        let throwError = true;
        

        const pessoa = await this.pessoasRepository.findOneBy({
            email: loginDto.email,
        });

        if(pessoa){
           passwordIsValid = await this.hashingService.compare(
                loginDto.password,
                pessoa.passwordHash,
            );
        }
        if(passwordIsValid){
            throwError = false;
        }

        if(throwError){
            throw new UnauthorizedException('Usuario ou senha invalida')
        }

        return {
            message: ' Usuario Logado!',
        };
    }

}