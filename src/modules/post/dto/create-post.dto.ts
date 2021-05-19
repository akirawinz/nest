import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'post content',
    required: true,
    example: 'this is post.',
  })
  @IsNotEmpty()
  description: string;

  /**
   * image url that will generated from our system
   */
  @ApiHideProperty()
  @IsOptional()
  image_url: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'image data',
    required: true,
  })
  @IsNotEmpty()
  image: any;
}
