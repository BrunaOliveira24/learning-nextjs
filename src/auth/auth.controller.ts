import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { loginDto } from "./DTO/login.dto";
import { RefreshTokenDto } from "./DTO/refresh-token.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    
    @Post()
    login(@Body() loginDto: loginDto){
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
      return this.authService.refreshTokens(refreshTokenDto);
    }
    }
