import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { loginDto } from "./DTO/login.dto";
import { Repository } from "typeorm";
import { Pessoa } from "src/pessoas/entities/pessoa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing.service";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoasRepository: Repository <Pessoa>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType <typeof jwtConfig>,
        private readonly jwtService: JwtService,
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

        const accesToken = await this.jwtService.signAsync(
        {
            sub: pessoa.id,
            email: pessoa.email,
        },
        {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn: this.jwtConfiguration.jwTtl,
        },
    );

        return {
            accesToken,
        };
    }

}