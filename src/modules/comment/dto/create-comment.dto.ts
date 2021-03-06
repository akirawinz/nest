import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'comment content',
    required: true,
    example: 'this is comment.',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'id of post which this comment attrach to',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  postId: number;
}
