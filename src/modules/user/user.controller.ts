import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
}
