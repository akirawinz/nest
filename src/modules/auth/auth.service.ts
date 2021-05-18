import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(username: string, userId: number): Promise<string> {
    const payload = { username, userId };
    return await this.jwtService.sign(payload);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<AuthUserDto> {
    const { username, id } = await this.userRepository.signUp(
      authCredentialsDto,
    );

    return {
      username,
      id,
      accessToken: await this.generateAccessToken(username, id),
    };
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AuthUserDto> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { id, username } = user;

    return {
      username,
      id,
      accessToken: await this.generateAccessToken(username, id),
    };
  }
}
