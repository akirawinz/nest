import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from './dto/auth-user.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: 'Users have been registered.',
    type: UserEntity,
  })
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthUserDto> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOkResponse({
    description: 'Users have been registered.',
    type: AuthUserDto,
  })
  @Post('/signIn')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthUserDto> {
    return this.authService.signIn(authCredentialsDto);
  }
}
