import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({
    description: 'username',
    required: true,
    example: 'akarawin',
  })
  username: string;

  @ApiProperty({
    description: 'user id',
    required: true,
    example: '26',
  })
  id: number;

  @ApiProperty({
    description: 'access token which can use with Bearer header.',
    required: true,
    example: 'this is mock access token.',
  })
  accessToken: string;
}
