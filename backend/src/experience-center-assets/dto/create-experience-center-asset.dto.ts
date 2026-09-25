import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExperienceCenterAssetDto {
  @IsNotEmpty()
  @IsString()
  parent_slug: string;

  @IsNotEmpty()
  @IsString()
  page_type: string;

  // Required for gallery images ("experience_center"); the video
  // ("experience_center_video") upload never sends this.
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
@IsString()
parent_asset_id?: string; // multipart sends it as a string; parsed to number in the service
}
