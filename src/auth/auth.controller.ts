import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

class AuthCredentialsDto {
  email: string;
  password: string;
}

class RegisterCredentialsDto extends AuthCredentialsDto {
  username: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/register')
  async register(
    @Body(ValidationPipe) credentials: RegisterCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.register(
      credentials.email,
      credentials.username,
      credentials.password,
    );
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) credentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(credentials.email, credentials.password);
  }
}