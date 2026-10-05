import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, Matches, MaxLength } from 'class-validator';

export class UpdateSlugEditDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @MaxLength(191)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug may only contain lowercase letters, numbers and single hyphens' })
  slug?: string;

  @IsOptional() @IsBoolean()
  isActive?: boolean;
}