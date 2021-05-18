import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({
    description: 'post id',
    required: true,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'post content',
    required: true,
    example: 'this is post.',
  })
  description: string;

  @ApiProperty({
    description: 'uploaded image url',
    required: false,
    example: 'https://image.com/beautiful.jpg',
  })
  image_url: string;
}
