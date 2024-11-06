import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { loginDto } from "./DTO/login.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing.service";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDto } from "./DTO/refresh-token.dto";
import { Pessoa } from "src/pessoas/entities/pessoa.entity";


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
        const pessoa = await this.pessoasRepository.findOneBy({
            email: loginDto.email,
            active:true,
        });

        if (!pessoa) {
            throw new UnauthorizedException('Pessoa não Autorizada.');
          }

      
          const passwordIsValid = await this.hashingService.compare(
            loginDto.password,
            pessoa.passwordHash,
          );
      
          if (!passwordIsValid) {
            throw new UnauthorizedException('Senha inválida!');
          }

        return this.creatTokens(pessoa);

    }
        private async creatTokens(pessoa: Pessoa){
            const accesToken = await this.signJwtAsync<Partial<Pessoa>>(
                pessoa.id, 
                this.jwtConfiguration.jwTtl,
                { email: pessoa.email }
            );
    
            const refreshTokenPromise = await this.signJwtAsync(
                pessoa.id, 
                this.jwtConfiguration.jwtRefreshTtl,
                {  }
            );
    
            return {
                accesToken,
                refreshTokenPromise,
            };
        }
        


    private async signJwtAsync<t>(sub: number, expiresIn: number, payLoad?: t) {
        return await this.jwtService.signAsync(
            {
                sub,
                ...payLoad,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn,
            }
        );
    }

async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );

      const pessoa = await this.pessoasRepository.findOneBy({
        id: sub,
      });

      if (!pessoa) {
        throw new Error('Pessoa não encontrada.');
      }

      return this.creatTokens(pessoa);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    }

}