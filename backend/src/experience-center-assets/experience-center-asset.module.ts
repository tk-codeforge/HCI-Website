import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceCenterAssetController } from './experience-center-asset.controller';
import { ExperienceCenterAssetService } from './experience-center-asset.service';
import { ExperienceCenterAsset } from './entities/experience-center-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExperienceCenterAsset])],
  controllers: [ExperienceCenterAssetController],
  providers: [ExperienceCenterAssetService],
})
export class ExperienceCenterAssetModule {}
