import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  @Public()
  login(@Body() loginDto: LoginDto): LoginResponseDto {
    // Simple authentication: accept any userId.
    // In production, I would create a user table and validate the user against the database.
    const payload = { userId: loginDto.userId, sub: loginDto.userId };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: loginDto.userId,
    };
  }
}
