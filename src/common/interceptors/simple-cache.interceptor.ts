

import { CallHandler, 
  ExecutionContext, 
  NestInterceptor } from '@nestjs/common';
import { of, tap } from 'rxjs';


export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map();


  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    if(this.cache.has(url)){
      console.log('estano cache', url);
      return of(this.cache.get(url));
    }


    return next.handle().pipe(
      tap(data => {
        this.cache.set(url,data);
        console.log('Armazendado em cache', url);
      }),
    );
  }
}