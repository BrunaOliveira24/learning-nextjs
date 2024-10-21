import { CallHandler, 
    ExecutionContext, 
    NestInterceptor } from '@nestjs/common';
  import { map } from 'rxjs';
  
  
  export class ChangeDataInterceptor implements NestInterceptor {
    private readonly cache = new Map();
  
  
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
      
  
  
      return next.handle().pipe(
        map(data => {
          return data;
        }),
      );
    }
  }