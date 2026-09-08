import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CmsBasicPagesService } from './cms-basic-pages.service';

@Controller('cms-basic-pages')
export class CmsBasicPagesController {
  constructor(private readonly pagesService: CmsBasicPagesService) {}

  @Post()
  create(@Body() data: any) { return this.pagesService.create(data); }

  @Get('all')
  findAll() { return this.pagesService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.pagesService.findOne(+id); }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) { return this.pagesService.findBySlug(slug); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.pagesService.update(+id, data); }

  @Patch('seo-content/:id')
  updateSeo(@Param('id') id: string, @Body() seoData: any) { return this.pagesService.updateSeo(+id, seoData); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.pagesService.remove(+id); }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) { return this.pagesService.duplicate(+id); }
}