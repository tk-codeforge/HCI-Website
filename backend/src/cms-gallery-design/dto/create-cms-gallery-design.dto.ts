import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCmsGalleryDesignDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  room_dimension: string;

  @IsOptional()
  @IsString()
  banner_heading?: string;

  @IsOptional()
  @IsString()
  banner_description?: string;
}