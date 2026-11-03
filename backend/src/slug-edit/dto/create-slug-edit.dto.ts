// import { Transform, Type } from 'class-transformer';
// import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min } from 'class-validator';
// // import { SLUG_ROUTES } from '../slug-edit.constants';

// export class CreateSlugEditDto {
//   // @IsIn(Object.keys(SLUG_ROUTES))
//   // entityType: string;
// @IsString() @MaxLength(50)
//   @Matches(/^(?:[a-z0-9-]+|center~[a-z0-9-]+)$/, { message: 'Invalid page type' })
//   entityType: string;

//   @Type(() => Number) @IsInt() @Min(1)
//   entityId: number;

//   @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
//   @IsNotEmpty()
//   @MaxLength(191)
//   @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug may only contain lowercase letters, numbers and single hyphens' })
//   slug: string;

//   @IsOptional() @IsBoolean()
// isActive?: boolean;
// }




import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSlugEditDto {
  @IsString()
  @MaxLength(50)
  @Matches(/^(?:[a-z0-9-]+|center~[a-z0-9-]+)$/, { message: 'Invalid page type' })
  entityType: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  entityId: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsNotEmpty()
  @MaxLength(191)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug may only contain lowercase letters, numbers and single hyphens',
  })
  slug: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsIn([301, 302], { message: 'Redirect type must be 301 or 302' })
  redirectStatus?: number;
}
