import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (e) {
      throw new InternalServerErrorException(`this is error`);
    }

    return user;
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validateUserPassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
