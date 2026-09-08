import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeOrm';
import { Repository } from 'typeorm';
import { CmsBasicPage } from './entities/cms-basic-page.entity';

@Injectable()
export class CmsBasicPagesService {
  constructor(
    @InjectRepository(CmsBasicPage)
    private readonly pageRepo: Repository<CmsBasicPage>,
  ) {}

  async create(data: any) {
    const newPage = this.pageRepo.create(data);
    return await this.pageRepo.save(newPage);
  }

  async findAll() {
    return await this.pageRepo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const page = await this.pageRepo.findOne({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findBySlug(slug: string) {
    // Searches inside the JSON seo_content for the slug
    const pages = await this.pageRepo.createQueryBuilder('page')
      .where('JSON_EXTRACT(page.seo_content, "$.slug") = :slug', { slug })
      .getMany();
    return pages.length > 0 ? pages[0] : null;
  }

  async update(id: number, data: any) {
    await this.pageRepo.update(id, data);
    return this.findOne(id);
  }

  async updateSeo(id: number, seoData: any) {
    const page = await this.findOne(id);
    page.seo_content = { ...page.seo_content, ...seoData };
    return await this.pageRepo.save(page);
  }

  async remove(id: number) {
    const page = await this.findOne(id);
    return await this.pageRepo.remove(page);
  }

  async duplicate(id: number) {
    const page = await this.findOne(id);
    const duplicate = this.pageRepo.create({
        ...page,
        id: undefined,
        title: `${page.title} (Copy)`,
        status: 'Draft',
        seo_content: { ...page.seo_content, slug: `${page.seo_content?.slug || 'page'}-copy-${Date.now()}` }
    });
    return await this.pageRepo.save(duplicate);
  }
}