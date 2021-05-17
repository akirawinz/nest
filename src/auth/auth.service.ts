import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { id: userId, username } = user;

    const payload = { userId, username };
    return {
      accessToken: await this.jwtService.sign(payload),
    };
  }
}
