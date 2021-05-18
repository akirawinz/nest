import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @ApiParam({ name: 'id', required: true, description: 'user id' })
  @ApiOkResponse({
    description: 'The user info has been successfully queried.',
    type: UserDto,
  })
  @Get('/:id')
  getUserById(@Param('id') id: number): Promise<UserDto> {
    return this.userService.getUserById(id);
  }
}
