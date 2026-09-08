import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeOrm';
import { CmsBasicPagesService } from './cms-basic-pages.service';
import { CmsBasicPagesController } from './cms-basic-pages.controller';
import { CmsBasicPage } from './entities/cms-basic-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CmsBasicPage])],
  controllers: [CmsBasicPagesController],
  providers: [CmsBasicPagesService],
})
export class CmsBasicPagesModule {}