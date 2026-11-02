import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CmsLandingPageService } from './cms-landing-page.service';
import { UpsertCmsLandingPageDto } from './dto/upsert-cms-landing-page.dto';

// NOTE: like cms_city, this controller has no @UseGuards(...), so PUT is open to anyone who can reach the API.
// If your project has an auth guard, add it to save() only (GET must stay public for the Next.js page).
@Controller('cms-landing-page')
export class CmsLandingPageController {
  constructor(private readonly service: CmsLandingPageService) {}

  // Public: the Next.js page reads this on the server.
  @Get(':pageKey')
  get(@Param('pageKey') pageKey: string) {
    return this.service.findByKey(pageKey);
  }

  // Called from the admin page /cms/design-your-dream-space.
  @Put(':pageKey')
  save(@Param('pageKey') pageKey: string, @Body() dto: UpsertCmsLandingPageDto) {
    return this.service.upsert(pageKey, dto.content);
  }
}
