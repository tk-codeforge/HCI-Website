import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlugSetting } from './entities/slug-setting.entity';
import { SlugHistory } from './entities/slug-history.entity';
import { SlugEditController } from './slug-edit.controller';
import { SlugEditService } from './slug-edit.service';

@Module({
  imports: [TypeOrmModule.forFeature([SlugSetting, SlugHistory])],
  controllers: [SlugEditController],
  providers: [SlugEditService],
  exports: [SlugEditService],
})
export class SlugEditModule {}