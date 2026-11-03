// import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

// export class CreateRedirectDto {
//   @IsString()
//   @IsNotEmpty()
//   old_url: string;

//   @IsString()
//   @IsNotEmpty()
//   new_url: string;

//   @IsNumber()
//   @IsOptional()
//   status_code?: number;

//   @IsBoolean()
//   @IsOptional()
//   is_active?: boolean;
// }



import { Type } from 'class-transformer';

import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateRedirectDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  old_url: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  new_url: string;

  @Type(() => Number)
  @IsNumber()
  @IsIn([301, 302])
  @IsOptional()
  status_code?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  // New property for custom URL rewrite functionality.
  @IsBoolean()
  @IsOptional()
  is_url_rewrite?: boolean;
}