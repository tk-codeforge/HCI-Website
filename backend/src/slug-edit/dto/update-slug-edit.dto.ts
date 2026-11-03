// import { Transform } from 'class-transformer';
// import { IsBoolean, IsOptional, Matches, MaxLength } from 'class-validator';

// export class UpdateSlugEditDto {
//   @IsOptional()
//   @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
//   @MaxLength(191)
//   @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug may only contain lowercase letters, numbers and single hyphens' })
//   slug?: string;

//   @IsOptional() @IsBoolean()
//   isActive?: boolean;
// }


import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, Matches, MaxLength } from 'class-validator';

export class UpdateSlugEditDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @MaxLength(191)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug may only contain lowercase letters, numbers and single hyphens',
  })
  slug?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsIn([301, 302], { message: 'Redirect type must be 301 or 302' })
  redirectStatus?: number;
}
