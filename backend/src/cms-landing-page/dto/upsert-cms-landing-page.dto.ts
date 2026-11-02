import { IsObject } from 'class-validator';

export class UpsertCmsLandingPageDto {
  @IsObject()
  content: Record<string, any>;
}
