import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCmsExperienceCenterDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  // @IsString()
  // description?: string;
  
  @IsOptional()
  @IsString()
  description?: string;
}