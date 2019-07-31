import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  getAll() {
    return { status: 'hello world' };
  }
}
