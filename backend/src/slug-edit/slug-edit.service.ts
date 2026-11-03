// import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { SlugSetting } from './entities/slug-setting.entity';
// import { SlugHistory } from './entities/slug-history.entity';
// import { CreateSlugEditDto } from './dto/create-slug-edit.dto';
// import { UpdateSlugEditDto } from './dto/update-slug-edit.dto';
// import { SLUG_ROUTES, baseFor, matchSlugPath, slugify } from './slug-edit.constants';

// @Injectable()
// export class SlugEditService {
//   constructor(
//     @InjectRepository(SlugSetting) private readonly repo: Repository<SlugSetting>,
//     @InjectRepository(SlugHistory) private readonly history: Repository<SlugHistory>,
//   ) {}

//   types() {
//     return Object.entries(SLUG_ROUTES).map(([type, basePath]) => ({ type, basePath }));
//   }

//   list(entityType?: string) {
//     return this.repo.find({
//       where: entityType ? { entityType } : {},
//       order: { updatedAt: 'DESC' },
//     });
//   }

//   // A slug is free if no active record uses it AND no OTHER item used it before (old links must not be hijacked)
//   async isAvailable(entityType: string, slug: string, entityId?: number, excludeId?: number) {
//     if (!slug) return false;
//     const qb = this.repo.createQueryBuilder('s')
//       .where('s.entityType = :entityType', { entityType })
//       .andWhere('s.slug = :slug', { slug });
//     if (excludeId) qb.andWhere('s.id != :excludeId', { excludeId });
//     if ((await qb.getCount()) > 0) return false;

//     const olds = await this.history.find({ where: { entityType, oldSlug: slug } });
//     return olds.every((o) => entityId !== undefined && o.entityId === entityId);
//   }

//   private async assertFree(entityType: string, slug: string, entityId: number, excludeId?: number) {
//     if (!(await this.isAvailable(entityType, slug, entityId, excludeId))) {
//       throw new ConflictException(`Slug "${slug}" is already in use`);
//     }
//   }

//   // Covers the race where two requests pass the check at the same moment
//   private rethrow(e: any): never {
//     if (e?.code === 'ER_DUP_ENTRY') throw new ConflictException('Slug is already in use');
//     throw e;
//   }

//   async create(dto: CreateSlugEditDto) {
//   const slug = slugify(dto.slug);
//   if (!slug) throw new BadRequestException('Slug cannot be empty');
//   if (!baseFor(dto.entityType)) throw new BadRequestException('Unknown page type');

//   const existing = await this.repo.findOne({ where: { entityType: dto.entityType, entityId: dto.entityId } });
//   if (existing) throw new ConflictException('This item already has a slug. Edit it instead.');

//   await this.assertFree(dto.entityType, slug, dto.entityId);
//   try {
//     const saved = await this.repo.save(
//       this.repo.create({ entityType: dto.entityType, entityId: dto.entityId, slug, isActive: dto.isActive ?? true }),
//     );
//     await this.history.delete({ entityType: dto.entityType, entityId: dto.entityId, oldSlug: slug });
//     return saved;
//   } catch (e) { this.rethrow(e); }
// }

// async slugMap(entityType: string) {
//   const rows = await this.repo.find({ where: { entityType, isActive: true } });
//   return Object.fromEntries(rows.map((r) => [r.entityId, r.slug]));
// }

//   async update(id: number, dto: UpdateSlugEditDto) {
//     const row = await this.repo.findOne({ where: { id } });
//     if (!row) throw new NotFoundException('Slug record not found');

//     const slug = dto.slug !== undefined ? slugify(dto.slug) : row.slug;
//     if (!slug) throw new BadRequestException('Slug cannot be empty');
//     if (dto.isActive !== undefined) row.isActive = dto.isActive;

//     if (slug === row.slug) return this.repo.save(row);

//     await this.assertFree(row.entityType, slug, row.entityId, id);
//     const oldSlug = row.slug;
//     try {
//       return await this.repo.manager.transaction(async (m) => {
//         await m.save(SlugHistory, m.create(SlugHistory, { entityType: row.entityType, entityId: row.entityId, oldSlug }));
//         await m.delete(SlugHistory, { entityType: row.entityType, entityId: row.entityId, oldSlug: slug }); // reverting to an old slug
//         row.slug = slug;
//         return m.save(row);
//       });
//     } catch (e) { this.rethrow(e); }
//   }

// //   async remove(id: number) {
// //     const row = await this.repo.findOne({ where: { id } });
// //     if (!row) throw new NotFoundException('Slug record not found');
// //     await this.history.delete({ entityType: row.entityType, entityId: row.entityId });
// //     await this.repo.delete(id);
// //     return { deleted: true };
// //   }

// async remove(id: number) {
//   const row = await this.repo.findOne({ where: { id } });
//   if (!row) throw new NotFoundException('Slug record not found');
//   await this.repo.manager.transaction(async (m) => {
//     // keep the deleted slug in history so its old URL can send visitors back to ?id=
//     await m.save(SlugHistory, m.create(SlugHistory, { entityType: row.entityType, entityId: row.entityId, oldSlug: row.slug }));
//     await m.delete(SlugSetting, id);
//   });
//   return { deleted: true };
// }

//   // Used by the frontend to turn ?id=103 into a slug URL
// //   async byEntity(entityType: string, entityId: number) {
// //     const row = await this.repo.findOne({ where: { entityType, entityId, isActive: true } });
// //     return row ? { slug: row.slug, canonical: `${SLUG_ROUTES[entityType]}/${row.slug}` } : { slug: null };
// //   }

// // async byEntity(entityType: string, entityId: number) {
// //   const base = SLUG_ROUTES[entityType];
// //   if (!base) return { slug: null };
// //   const row = await this.repo.findOne({ where: { entityType, entityId, isActive: true } });
// //   return row ? { slug: row.slug, canonical: `${base}/${row.slug}` } : { slug: null };
// // }

//   // Used by the frontend middleware to turn /product/gallery/<slug> into an id
// //   async resolvePath(path: string) {
// //     const clean = (path || '').split('?')[0].replace(/\/+$/, '');
// //     const hit = Object.entries(SLUG_ROUTES).find(([, base]) => clean.startsWith(base + '/'));
// //     if (!hit) throw new NotFoundException();
// //     const [entityType, base] = hit;

// //     const slug = decodeURIComponent(clean.slice(base.length + 1)).toLowerCase();
// //     if (!slug || slug.includes('/')) throw new NotFoundException();

// //     const row = await this.repo.findOne({ where: { entityType, slug, isActive: true } });
// //     if (row) return { entityType, entityId: row.entityId, canonical: `${base}/${row.slug}`, redirect: false };

// //     const old = await this.history.findOne({ where: { entityType, oldSlug: slug }, order: { id: 'DESC' } });
// //     if (old) {
// //       const cur = await this.repo.findOne({ where: { entityType, entityId: old.entityId, isActive: true } });
// //       if (cur) return { entityType, entityId: cur.entityId, canonical: `${base}/${cur.slug}`, redirect: true };
// //     }
// //     throw new NotFoundException('Slug not found');
// //   }

// // async resolvePath(path: string) {
// //   const clean = (path || '').split('?')[0].replace(/\/+$/, '');
// //   const hit = Object.entries(SLUG_ROUTES).find(([, base]) => clean.startsWith(base + '/'));
// //   if (!hit) throw new NotFoundException();
// //   const [entityType, base] = hit;

// //   const slug = decodeURIComponent(clean.slice(base.length + 1)).toLowerCase();
// //   if (!slug || slug.includes('/')) throw new NotFoundException();

// //   const row = await this.repo.findOne({ where: { entityType, slug } });
// //   if (row?.isActive) return { entityType, entityId: row.entityId, canonical: `${base}/${row.slug}`, redirect: false };
// //   // slug exists but is disabled -> back to the original URL
// //   if (row) return { entityType, entityId: row.entityId, canonical: `${base}?id=${row.entityId}`, redirect: true };

// //   const old = await this.history.findOne({ where: { entityType, oldSlug: slug }, order: { id: 'DESC' } });
// //   if (old) {
// //     const cur = await this.repo.findOne({ where: { entityType, entityId: old.entityId, isActive: true } });
// //     return cur
// //       ? { entityType, entityId: cur.entityId, canonical: `${base}/${cur.slug}`, redirect: true }        // renamed
// //       : { entityType, entityId: old.entityId, canonical: `${base}?id=${old.entityId}`, redirect: true }; // deleted or disabled
// //   }
// //   throw new NotFoundException('Slug not found');
// // }

// async byEntity(entityType: string, entityId: number) {
//   const base = baseFor(entityType);
//   if (!base) return { slug: null };
//   const row = await this.repo.findOne({ where: { entityType, entityId, isActive: true } });
//   return row ? { slug: row.slug, canonical: `${base}/${row.slug}` } : { slug: null };
// }

// async resolvePath(path: string) {
//   const clean = (path || '').split('?')[0].replace(/\/+$/, '');
//   const hit = matchSlugPath(clean);
//   if (!hit) throw new NotFoundException();
//   const { entityType, base } = hit;

//   const slug = decodeURIComponent(hit.slug).toLowerCase();
//   if (!slug || slug.includes('/')) throw new NotFoundException();

//   const row = await this.repo.findOne({ where: { entityType, slug } });
//   if (row?.isActive) return { entityType, entityId: row.entityId, canonical: `${base}/${row.slug}`, redirect: false };
//   if (row) return { entityType, entityId: row.entityId, canonical: `${base}?id=${row.entityId}`, redirect: true };

//   const old = await this.history.findOne({ where: { entityType, oldSlug: slug }, order: { id: 'DESC' } });
//   if (old) {
//     const cur = await this.repo.findOne({ where: { entityType, entityId: old.entityId, isActive: true } });
//     return cur
//       ? { entityType, entityId: cur.entityId, canonical: `${base}/${cur.slug}`, redirect: true }
//       : { entityType, entityId: old.entityId, canonical: `${base}?id=${old.entityId}`, redirect: true };
//   }
//   throw new NotFoundException('Slug not found');
// }
// }




import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlugSetting } from './entities/slug-setting.entity';
import { SlugHistory } from './entities/slug-history.entity';
import { CreateSlugEditDto } from './dto/create-slug-edit.dto';
import { UpdateSlugEditDto } from './dto/update-slug-edit.dto';
import { resolveBooleanPublishState } from '../auth/utils/cms-access.util';
import { Redirect } from '../redirects/entity/redirect.entity';
import {
  SLUG_ROUTES,
  baseFor,
  canonicalSlugPath,
  matchSlugPath,
  slugify,
} from './slug-edit.constants';

@Injectable()
export class SlugEditService {
  constructor(
    @InjectRepository(SlugSetting)
    private readonly repo: Repository<SlugSetting>,
    @InjectRepository(SlugHistory)
    private readonly history: Repository<SlugHistory>,
    @InjectRepository(Redirect)
    private readonly redirects: Repository<Redirect>,
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

  // A slug cannot be reused by another item, including a slug retained in history.
  async isAvailable(
    entityType: string,
    slug: string,
    entityId?: number,
    excludeId?: number,
  ) {
    if (!slug) return false;

    const query = this.repo
      .createQueryBuilder('s')
      .where('s.entityType = :entityType', { entityType })
      .andWhere('s.slug = :slug', { slug });
    if (excludeId) query.andWhere('s.id != :excludeId', { excludeId });
    if ((await query.getCount()) > 0) return false;

    const previousUses = await this.history.find({ where: { entityType, oldSlug: slug } });
    const historyAvailable = previousUses.every(
      (item) => entityId !== undefined && item.entityId === entityId,
    );
    if (!historyAvailable) return false;

    try {
      await this.assertCanonicalPathIsFree(entityType, slug);
      return true;
    } catch (error) {
      if (error instanceof ConflictException) return false;
      throw error;
    }
  }

  private async assertCanonicalPathIsFree(entityType: string, slug: string) {
    const canonical = canonicalSlugPath(entityType, slug);
    if (!canonical) throw new BadRequestException('Unknown page type');

    const requestedPath = (new URL(canonical, 'https://hcinterior.in').pathname.replace(/\/$/, '') || '/').toLowerCase();
    const redirects = await this.redirects.find();
    for (const redirect of redirects) {
      const oldPath = (new URL(redirect.old_url, 'https://hcinterior.in').pathname.replace(/\/$/, '') || '/').toLowerCase();
      const newPath = (new URL(redirect.new_url, 'https://hcinterior.in').pathname.replace(/\/$/, '') || '/').toLowerCase();

      // Any redirect source owns its path. URL-alias destinations also own
      // their public path because requests to them are rewritten internally.
      if (oldPath === requestedPath || (redirect.is_url_rewrite && newPath === requestedPath)) {
        throw new ConflictException(`This slug URL conflicts with an existing URL mapping: "${canonical}"`);
      }
    }
  }

  private async assertFree(
    entityType: string,
    slug: string,
    entityId: number,
    excludeId?: number,
  ) {
    if (!(await this.isAvailable(entityType, slug, entityId, excludeId))) {
      throw new ConflictException(`Slug "${slug}" is already in use or conflicts with an existing URL mapping`);
    }
  }

  private rethrow(error: any): never {
    if (error?.code === 'ER_DUP_ENTRY') {
      throw new ConflictException('Slug is already in use');
    }
    throw error;
  }

  async create(dto: CreateSlugEditDto, user?: any) {
    const slug = slugify(dto.slug);
    if (!slug) throw new BadRequestException('Slug cannot be empty');
    if (!baseFor(dto.entityType)) throw new BadRequestException('Unknown page type');

    const existing = await this.repo.findOne({
      where: { entityType: dto.entityType, entityId: dto.entityId },
    });
    if (existing) {
      throw new ConflictException('This item already has a slug. Edit it instead.');
    }

    await this.assertFree(dto.entityType, slug, dto.entityId);
    try {
      const requestedActiveState = dto.isActive ?? true;
      const resolvedActiveState = resolveBooleanPublishState(requestedActiveState, user);
      const saved = await this.repo.save(
        this.repo.create({
          entityType: dto.entityType,
          entityId: dto.entityId,
          slug,
          isActive:
            typeof resolvedActiveState === 'boolean'
              ? resolvedActiveState
              : requestedActiveState,
          redirectStatus: dto.redirectStatus ?? 301,
        }),
      );
      await this.history.delete({
        entityType: dto.entityType,
        entityId: dto.entityId,
        oldSlug: slug,
      });
      return saved;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async slugMap(entityType: string) {
    const rows = await this.repo.find({ where: { entityType, isActive: true } });
    return Object.fromEntries(rows.map((row) => [row.entityId, row.slug]));
  }

  async update(id: number, dto: UpdateSlugEditDto, user?: any) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Slug record not found');

    const slug = dto.slug !== undefined ? slugify(dto.slug) : row.slug;
    if (!slug) throw new BadRequestException('Slug cannot be empty');

    if (slug !== row.slug) {
      await this.assertFree(row.entityType, slug, row.entityId, id);
    }
    if (dto.isActive !== undefined) {
      const resolvedActiveState = resolveBooleanPublishState(dto.isActive, user);
      row.isActive =
        typeof resolvedActiveState === 'boolean'
          ? resolvedActiveState
          : dto.isActive;
    }
    if (dto.redirectStatus !== undefined) {
      if (![301, 302].includes(Number(dto.redirectStatus))) {
        throw new BadRequestException('Redirect type must be 301 or 302');
      }
      row.redirectStatus = Number(dto.redirectStatus);
    }
    if (slug === row.slug) return this.repo.save(row);

    const oldSlug = row.slug;
    try {
      return await this.repo.manager.transaction(async (manager) => {
        await manager.save(
          SlugHistory,
          manager.create(SlugHistory, {
            entityType: row.entityType,
            entityId: row.entityId,
            oldSlug,
          }),
        );
        // Remove the historical row when reverting to a previous slug.
        await manager.delete(SlugHistory, {
          entityType: row.entityType,
          entityId: row.entityId,
          oldSlug: slug,
        });
        row.slug = slug;
        return manager.save(row);
      });
    } catch (error) {
      this.rethrow(error);
    }
  }

  async remove(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Slug record not found');

    await this.repo.manager.transaction(async (manager) => {
      // Preserve the deleted slug so requests to it can return to the original ?id= URL.
      await manager.save(
        SlugHistory,
        manager.create(SlugHistory, {
          entityType: row.entityType,
          entityId: row.entityId,
          oldSlug: row.slug,
        }),
      );
      await manager.delete(SlugSetting, id);
    });

    return { deleted: true };
  }

  // Used to turn the legacy ?id= URL into the active canonical URL.
  async byEntity(entityType: string, entityId: number) {
    const row = await this.repo.findOne({
      where: { entityType, entityId, isActive: true },
    });
    if (!row || !baseFor(entityType)) return { slug: null };

    return {
      slug: row.slug,
      canonical: canonicalSlugPath(entityType, row.slug),
      redirectStatus: row.redirectStatus || 301,
    };
  }

  // Resolves both /parent/slug and the previous /parent/gallery/slug structure.
  async resolvePath(path: string) {
    const clean = (path || '').split('?')[0].replace(/\/+$/, '') || '/';
    const hit = matchSlugPath(clean);
    if (!hit) throw new NotFoundException('Slug path not found');

    let slug: string;
    try {
      slug = decodeURIComponent(hit.slug).toLowerCase();
    } catch {
      throw new BadRequestException('Invalid encoded slug');
    }
    if (!slug || slug.includes('/')) throw new NotFoundException('Invalid slug path');

    const row = await this.repo.findOne({
      where: { entityType: hit.entityType, slug },
    });

    if (row?.isActive) {
      const canonical = canonicalSlugPath(hit.entityType, row.slug);
      return {
        entityType: hit.entityType,
        entityId: row.entityId,
        canonical,
        redirect: clean !== canonical,
        redirectStatus: row.redirectStatus || 301,
      };
    }

    if (row) {
      return {
        entityType: hit.entityType,
        entityId: row.entityId,
        canonical: `${hit.base}?id=${row.entityId}`,
        redirect: true,
        redirectStatus: row.redirectStatus || 302,
      };
    }

    const old = await this.history.findOne({
      where: { entityType: hit.entityType, oldSlug: slug },
      order: { id: 'DESC' },
    });

    if (old) {
      const current = await this.repo.findOne({
        where: {
          entityType: hit.entityType,
          entityId: old.entityId,
          isActive: true,
        },
      });
      return current
        ? {
            entityType: hit.entityType,
            entityId: current.entityId,
            canonical: canonicalSlugPath(hit.entityType, current.slug),
            redirect: true,
            redirectStatus: current.redirectStatus || 301,
          }
        : {
            entityType: hit.entityType,
            entityId: old.entityId,
            canonical: `${hit.base}?id=${old.entityId}`,
            redirect: true,
            redirectStatus: 302,
          };
    }

    throw new NotFoundException('Slug not found');
  }
}
