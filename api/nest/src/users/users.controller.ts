import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('admin')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  async signup(@Body() dto: UserDto): Promise<void> {
    await this.userService.signup(dto);
  }

  @HttpCode(HttpStatus.OK) //createではなくokを返す。
  @Post('signin')
  async signin(@Body() dto: UserDto): Promise<{ access_token: string }> {
    return await this.userService.signin(dto);
  }
}
