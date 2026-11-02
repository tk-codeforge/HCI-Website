import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsLandingPage } from './cms-landing-page.entity';
import { CmsLandingPageController } from './cms-landing-page.controller';
import { CmsLandingPageService } from './cms-landing-page.service';

@Module({
  imports: [TypeOrmModule.forFeature([CmsLandingPage])],
  controllers: [CmsLandingPageController],
  providers: [CmsLandingPageService],
})
export class CmsLandingPageModule {}
