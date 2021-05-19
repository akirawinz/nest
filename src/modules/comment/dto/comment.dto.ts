import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({
    description: 'comment id',
    required: false,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'comment content',
    required: false,
    example: 'you just create a comment.',
  })
  description: string;

  @ApiProperty({
    description: 'id of post which this comment attrach to',
    required: false,
    example: 8,
  })
  postId: number;
}
