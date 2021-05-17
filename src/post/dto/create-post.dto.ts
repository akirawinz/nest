import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  description: string;
  @IsOptional()
  image_url: string;
}
