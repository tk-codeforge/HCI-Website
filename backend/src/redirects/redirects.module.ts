import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedirectsService } from './redirects.service';
import { RedirectsController } from './redirects.controller';
import { Redirect } from './entity/redirect.entity';
import { SlugSetting } from '../slug-edit/entities/slug-setting.entity';

@Module({
  // imports: [TypeOrmModule.forFeature([Redirect])],
  imports: [
  TypeOrmModule.forFeature([
    Redirect,
    SlugSetting,
  ]),
],
  controllers: [RedirectsController],
  providers: [RedirectsService],
  exports: [RedirectsService],
})
export class RedirectsModule {}