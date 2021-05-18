import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRepository } from '../user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '@modules/user/dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'daytechComp',
    });
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    const { username } = payload;
    const user = await this.userRepository.findOne(
      {
        username,
      },
      // be careful with select, so returned type is not entity User anymore
      { select: ['username', 'id'] },
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      username: user.username,
      id: user.id,
    };
  }
}
