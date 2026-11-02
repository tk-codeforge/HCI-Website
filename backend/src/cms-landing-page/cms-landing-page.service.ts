import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsLandingPage } from './cms-landing-page.entity';

const PAGE_KEY_PATTERN = /^[a-z0-9][a-z0-9_-]{0,119}$/;

@Injectable()
export class CmsLandingPageService {
  constructor(
    @InjectRepository(CmsLandingPage)
    private readonly repo: Repository<CmsLandingPage>,
  ) {}

  private assertKey(pageKey: string) {
    if (!PAGE_KEY_PATTERN.test(pageKey)) {
      throw new BadRequestException('Invalid page key');
    }
  }

  // Never 404s: the landing page simply falls back to its built-in defaults when nothing is saved.
  async findByKey(pageKey: string) {
    this.assertKey(pageKey);
    const row = await this.repo.findOne({ where: { page_key: pageKey } });
    return {
      page_key: pageKey,
      content: row?.content ?? null,
      updated_at: row?.updated_at ?? null,
    };
  }

  async upsert(pageKey: string, content: Record<string, any>) {
    this.assertKey(pageKey);
    const row =
      (await this.repo.findOne({ where: { page_key: pageKey } })) ??
      this.repo.create({ page_key: pageKey });
    row.content = content;
    const saved = await this.repo.save(row);
    return { page_key: saved.page_key, content: saved.content, updated_at: saved.updated_at };
  }
}
