import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  description: string;
  @IsOptional()
  @IsNumber()
  postId: number;
}
