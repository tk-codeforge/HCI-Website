import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlugSetting } from './entities/slug-setting.entity';
import { SlugHistory } from './entities/slug-history.entity';
import { CreateSlugEditDto } from './dto/create-slug-edit.dto';
import { UpdateSlugEditDto } from './dto/update-slug-edit.dto';
import { SLUG_ROUTES, baseFor, matchSlugPath, slugify } from './slug-edit.constants';

@Injectable()
export class SlugEditService {
  constructor(
    @InjectRepository(SlugSetting) private readonly repo: Repository<SlugSetting>,
    @InjectRepository(SlugHistory) private readonly history: Repository<SlugHistory>,
  ) {}

  types() {
    return Object.entries(SLUG_ROUTES).map(([type, basePath]) => ({ type, basePath }));
  }

  list(entityType?: string) {
    return this.repo.find({
      where: entityType ? { entityType } : {},
      order: { updatedAt: 'DESC' },
    });
  }

  // A slug is free if no active record uses it AND no OTHER item used it before (old links must not be hijacked)
  async isAvailable(entityType: string, slug: string, entityId?: number, excludeId?: number) {
    if (!slug) return false;
    const qb = this.repo.createQueryBuilder('s')
      .where('s.entityType = :entityType', { entityType })
      .andWhere('s.slug = :slug', { slug });
    if (excludeId) qb.andWhere('s.id != :excludeId', { excludeId });
    if ((await qb.getCount()) > 0) return false;

    const olds = await this.history.find({ where: { entityType, oldSlug: slug } });
    return olds.every((o) => entityId !== undefined && o.entityId === entityId);
  }

  private async assertFree(entityType: string, slug: string, entityId: number, excludeId?: number) {
    if (!(await this.isAvailable(entityType, slug, entityId, excludeId))) {
      throw new ConflictException(`Slug "${slug}" is already in use`);
    }
  }

  // Covers the race where two requests pass the check at the same moment
  private rethrow(e: any): never {
    if (e?.code === 'ER_DUP_ENTRY') throw new ConflictException('Slug is already in use');
    throw e;
  }

  async create(dto: CreateSlugEditDto) {
  const slug = slugify(dto.slug);
  if (!slug) throw new BadRequestException('Slug cannot be empty');
  if (!baseFor(dto.entityType)) throw new BadRequestException('Unknown page type');

  const existing = await this.repo.findOne({ where: { entityType: dto.entityType, entityId: dto.entityId } });
  if (existing) throw new ConflictException('This item already has a slug. Edit it instead.');

  await this.assertFree(dto.entityType, slug, dto.entityId);
  try {
    const saved = await this.repo.save(
      this.repo.create({ entityType: dto.entityType, entityId: dto.entityId, slug, isActive: dto.isActive ?? true }),
    );
    await this.history.delete({ entityType: dto.entityType, entityId: dto.entityId, oldSlug: slug });
    return saved;
  } catch (e) { this.rethrow(e); }
}

async slugMap(entityType: string) {
  const rows = await this.repo.find({ where: { entityType, isActive: true } });
  return Object.fromEntries(rows.map((r) => [r.entityId, r.slug]));
}

  async update(id: number, dto: UpdateSlugEditDto) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Slug record not found');

    const slug = dto.slug !== undefined ? slugify(dto.slug) : row.slug;
    if (!slug) throw new BadRequestException('Slug cannot be empty');
    if (dto.isActive !== undefined) row.isActive = dto.isActive;

    if (slug === row.slug) return this.repo.save(row);

    await this.assertFree(row.entityType, slug, row.entityId, id);
    const oldSlug = row.slug;
    try {
      return await this.repo.manager.transaction(async (m) => {
        await m.save(SlugHistory, m.create(SlugHistory, { entityType: row.entityType, entityId: row.entityId, oldSlug }));
        await m.delete(SlugHistory, { entityType: row.entityType, entityId: row.entityId, oldSlug: slug }); // reverting to an old slug
        row.slug = slug;
        return m.save(row);
      });
    } catch (e) { this.rethrow(e); }
  }

//   async remove(id: number) {
//     const row = await this.repo.findOne({ where: { id } });
//     if (!row) throw new NotFoundException('Slug record not found');
//     await this.history.delete({ entityType: row.entityType, entityId: row.entityId });
//     await this.repo.delete(id);
//     return { deleted: true };
//   }

async remove(id: number) {
  const row = await this.repo.findOne({ where: { id } });
  if (!row) throw new NotFoundException('Slug record not found');
  await this.repo.manager.transaction(async (m) => {
    // keep the deleted slug in history so its old URL can send visitors back to ?id=
    await m.save(SlugHistory, m.create(SlugHistory, { entityType: row.entityType, entityId: row.entityId, oldSlug: row.slug }));
    await m.delete(SlugSetting, id);
  });
  return { deleted: true };
}

  // Used by the frontend to turn ?id=103 into a slug URL
//   async byEntity(entityType: string, entityId: number) {
//     const row = await this.repo.findOne({ where: { entityType, entityId, isActive: true } });
//     return row ? { slug: row.slug, canonical: `${SLUG_ROUTES[entityType]}/${row.slug}` } : { slug: null };
//   }

// async byEntity(entityType: string, entityId: number) {
//   const base = SLUG_ROUTES[entityType];
//   if (!base) return { slug: null };
//   const row = await this.repo.findOne({ where: { entityType, entityId, isActive: true } });
//   return row ? { slug: row.slug, canonical: `${base}/${row.slug}` } : { slug: null };
// }

  // Used by the frontend middleware to turn /product/gallery/<slug> into an id
//   async resolvePath(path: string) {
//     const clean = (path || '').split('?')[0].replace(/\/+$/, '');
//     const hit = Object.entries(SLUG_ROUTES).find(([, base]) => clean.startsWith(base + '/'));
//     if (!hit) throw new NotFoundException();
//     const [entityType, base] = hit;

//     const slug = decodeURIComponent(clean.slice(base.length + 1)).toLowerCase();
//     if (!slug || slug.includes('/')) throw new NotFoundException();

//     const row = await this.repo.findOne({ where: { entityType, slug, isActive: true } });
//     if (row) return { entityType, entityId: row.entityId, canonical: `${base}/${row.slug}`, redirect: false };

//     const old = await this.history.findOne({ where: { entityType, oldSlug: slug }, order: { id: 'DESC' } });
//     if (old) {
//       const cur = await this.repo.findOne({ where: { entityType, entityId: old.entityId, isActive: true } });
//       if (cur) return { entityType, entityId: cur.entityId, canonical: `${base}/${cur.slug}`, redirect: true };
//     }
//     throw new NotFoundException('Slug not found');
//   }

// async resolvePath(path: string) {
//   const clean = (path || '').split('?')[0].replace(/\/+$/, '');
//   const hit = Object.entries(SLUG_ROUTES).find(([, base]) => clean.startsWith(base + '/'));
//   if (!hit) throw new NotFoundException();
//   const [entityType, base] = hit;

//   const slug = decodeURIComponent(clean.slice(base.length + 1)).toLowerCase();
//   if (!slug || slug.includes('/')) throw new NotFoundException();

//   const row = await this.repo.findOne({ where: { entityType, slug } });
//   if (row?.isActive) return { entityType, entityId: row.entityId, canonical: `${base}/${row.slug}`, redirect: false };
//   // slug exists but is disabled -> back to the original URL
//   if (row) return { entityType, entityId: row.entityId, canonical: `${base}?id=${row.entityId}`, redirect: true };

//   const old = await this.history.findOne({ where: { entityType, oldSlug: slug }, order: { id: 'DESC' } });
//   if (old) {
//     const cur = await this.repo.findOne({ where: { entityType, entityId: old.entityId, isActive: true } });
//     return cur
//       ? { entityType, entityId: cur.entityId, canonical: `${base}/${cur.slug}`, redirect: true }        // renamed
//       : { entityType, entityId: old.entityId, canonical: `${base}?id=${old.entityId}`, redirect: true }; // deleted or disabled
//   }
//   throw new NotFoundException('Slug not found');
// }

async byEntity(entityType: string, entityId: number) {
  const base = baseFor(entityType);
  if (!base) return { slug: null };
  const row = await this.repo.findOne({ where: { entityType, entityId, isActive: true } });
  return row ? { slug: row.slug, canonical: `${base}/${row.slug}` } : { slug: null };
}

async resolvePath(path: string) {
  const clean = (path || '').split('?')[0].replace(/\/+$/, '');
  const hit = matchSlugPath(clean);
  if (!hit) throw new NotFoundException();
  const { entityType, base } = hit;

  const slug = decodeURIComponent(hit.slug).toLowerCase();
  if (!slug || slug.includes('/')) throw new NotFoundException();

  const row = await this.repo.findOne({ where: { entityType, slug } });
  if (row?.isActive) return { entityType, entityId: row.entityId, canonical: `${base}/${row.slug}`, redirect: false };
  if (row) return { entityType, entityId: row.entityId, canonical: `${base}?id=${row.entityId}`, redirect: true };

  const old = await this.history.findOne({ where: { entityType, oldSlug: slug }, order: { id: 'DESC' } });
  if (old) {
    const cur = await this.repo.findOne({ where: { entityType, entityId: old.entityId, isActive: true } });
    return cur
      ? { entityType, entityId: cur.entityId, canonical: `${base}/${cur.slug}`, redirect: true }
      : { entityType, entityId: old.entityId, canonical: `${base}?id=${old.entityId}`, redirect: true };
  }
  throw new NotFoundException('Slug not found');
}
}