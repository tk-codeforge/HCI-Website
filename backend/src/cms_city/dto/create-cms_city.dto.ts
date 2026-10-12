import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCmsCityDto {
  @IsString()
  @IsNotEmpty()
  city_type: string;

  @IsString()
  @IsNotEmpty()
  main_title: string;

  @IsString()
  @IsOptional()
  main_description?: string;

  @IsString()
  @IsOptional()
  side_title?: string;

  @IsString()
  @IsOptional()
  side_description?: string;

  // --- NEW HERO BANNER FIELDS ---
  @IsString()
  @IsOptional()
  banner_title?: string;

  @IsString()
  @IsOptional()
  banner_subtitle?: string;

  @IsString()
@IsOptional()
@MaxLength(255)
banner_image_alt?: string;

@IsString()
@IsOptional()
@MaxLength(255)
location_image_alt?: string;

@IsString()
@IsOptional()
@MaxLength(255)
side_image_alt?: string;
  // ------------------------------

  @IsOptional()
@IsIn(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
main_title_tag?: string;

@IsOptional()
@IsIn(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
banner_title_tag?: string;

@IsOptional()
@IsIn(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
side_title_tag?: string;
}