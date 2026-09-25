import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateExperienceCenterAssetDto } from './create-experience-center-asset.dto';

export class UpdateExperienceCenterAssetDto extends PartialType(
  CreateExperienceCenterAssetDto,
) {
  @IsOptional()
  @IsString()
  image?: string;
}
