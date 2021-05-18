import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from '../user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
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
  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.userRepository.findOne(
      {
        username,
      },
      { select: ['username', 'id'] },
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
