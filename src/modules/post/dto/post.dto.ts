import { IsNotEmpty, IsOptional } from 'class-validator';

export class PostDto {
  /**
   * post description
   */
  @IsNotEmpty()
  description: string;

  /**
   * image url
   */
  @IsOptional()
  image_url: string;

  /**
   * ???
   */
  @IsOptional()
  image: any;
}
