import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'username',
    required: true,
    example: 'akarawin',
  })
  username: string;

  @ApiProperty({
    description: 'user id',
    required: true,
    example: 1,
  })
  id: number;
}
