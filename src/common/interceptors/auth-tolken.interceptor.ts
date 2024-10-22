
import { CallHandler, 
  ExecutionContext, 
  Injectable,
  NestInterceptor, 
  UnauthorizedException} from '@nestjs/common';


@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
  //checar o token
    if(!token || token != "123456") {
    
      throw new UnauthorizedException('Usuario nao logado');
    }
    return next.handle();
  }

}

