// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { SeoTag } from './entities/seo_tag.entity';
// import { CreateSeoTagDto } from './dto/create-seo_tag.dto';
// import { UpdateSeoTagDto } from './dto/update-seo_tag.dto';
// import { resolveActiveStatus } from '../auth/utils/cms-access.util';

// @Injectable()
// export class SeoTagService {
//   constructor(
//     @InjectRepository(SeoTag)
//     private readonly seoTagRepository: Repository<SeoTag>,
//   ) {}

//   private normalizeSeoPayload<T extends Partial<CreateSeoTagDto> & { title?: string; meta_can_tag?: string }>(
//   dto: T,
// ): Partial<SeoTag> {
//   const { title, meta_can_tag, meta_title, canonical_url, ...rest } = dto as Record<string, any>;
//   const result: Partial<SeoTag> = { ...rest };

//   if (meta_title !== undefined || title !== undefined) {
//     result.meta_title = meta_title ?? title;
//   }
//   if (canonical_url !== undefined || meta_can_tag !== undefined) {
//     result.canonical_url = canonical_url ?? meta_can_tag;
//   }

//   return result;
// }

//   async create(createSeoTagDto: CreateSeoTagDto, user?: any): Promise<SeoTag> {
//     const seoTag = this.seoTagRepository.create({
//       // ...createSeoTagDto,
//       ...this.normalizeSeoPayload(createSeoTagDto),
//       status: resolveActiveStatus(createSeoTagDto?.status || 'inactive', user),
//     });
//     return await this.seoTagRepository.save(seoTag);
//   }

//   async findAll(status?: string): Promise<SeoTag[]> {
//     const whereCondition = status ? { status } : {};
//     return await this.seoTagRepository.find({
//       where: whereCondition,
//       order: { id: 'DESC' },
//     });
//   }

//   async findOne(id: number): Promise<SeoTag> {
//     const record = await this.seoTagRepository.findOne({ where: { id } });
//     if (!record) throw new NotFoundException(`SEO Tag with ID ${id} not found`);
//     return record;
//   }

//   // 🌟 Smart matching to handle full URLs like "https://hcinterior.in"
//   async findByPageName(page_name: string): Promise<SeoTag> {
//     // Check if the requested route is the home page
//     const isHome = page_name === '/' || page_name === '/home' || page_name === 'https://hcinterior.in' || page_name === 'https://hcinterior.in/';

//     const queryBuilder = this.seoTagRepository.createQueryBuilder('seoTag')
//       .where('seoTag.status = :status', { status: 'active' });

//     if (isHome) {
//       // For the home page, match any of these database variations
//       queryBuilder.andWhere('(seoTag.page_name = :home1 OR seoTag.page_name = :home2 OR seoTag.page_name = :home3 OR seoTag.page_name = :home4)', {
//         home1: '/',
//         home2: '/home',
//         home3: 'https://hcinterior.in',
//         home4: 'https://hcinterior.in/'
//       });
//     } else {
//       // For other pages, strip any domain just in case, and prepare variations
//       const cleanPath = page_name.replace(/^https?:\/\/hcinterior\.in/, '');
//       const withSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
//       const withoutSlash = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
//       const fullUrl = `https://hcinterior.in${withSlash}`;

//       // Match /about-us OR about-us OR https://hcinterior.in/about-us
//       queryBuilder.andWhere('(seoTag.page_name = :withSlash OR seoTag.page_name = :withoutSlash OR seoTag.page_name = :fullUrl)', {
//         withSlash,
//         withoutSlash,
//         fullUrl
//       });
//     }

//     const record = await queryBuilder.getOne();

//     if (!record) throw new NotFoundException(`Active SEO Tag for page ${page_name} not found`);
//     return record;
//   }

//   async update(id: number, updateSeoTagDto: UpdateSeoTagDto, user?: any): Promise<SeoTag> {
//     const record = await this.findOne(id);
//     Object.assign(record, {
//       // ...updateSeoTagDto,
//       ...this.normalizeSeoPayload(updateSeoTagDto),
//       status:
//         updateSeoTagDto?.status !== undefined
//           ? resolveActiveStatus(updateSeoTagDto.status, user)
//           : record.status,
//     });
//     return await this.seoTagRepository.save(record);
//   }

//   async remove(id: number): Promise<void> {
//     const record = await this.findOne(id);
//     await this.seoTagRepository.softDelete(id);
//   }


//   // Add this method anywhere inside the SeoTagService class
//   async migrateLegacyData() {
//     await this.seoTagRepository.query(`
//       UPDATE seo_tag 
//       SET meta_title = title 
//       WHERE meta_title IS NULL AND title IS NOT NULL;
//     `);
    
//     await this.seoTagRepository.query(`
//       UPDATE seo_tag 
//       SET canonical_url = meta_can_tag 
//       WHERE canonical_url IS NULL AND meta_can_tag IS NOT NULL;
//     `);
    
//     return { success: true, message: "All legacy SEO data successfully migrated!" };
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeoTag } from './entities/seo_tag.entity';
import { CreateSeoTagDto } from './dto/create-seo_tag.dto';
import { UpdateSeoTagDto } from './dto/update-seo_tag.dto';
import { resolveActiveStatus } from '../auth/utils/cms-access.util';

@Injectable()
export class SeoTagService {
  constructor(
    @InjectRepository(SeoTag)
    private readonly seoTagRepository: Repository<SeoTag>,
  ) {}

  private normalizeSeoPayload<T extends Record<string, any>>(dto: T): Partial<SeoTag> {
    // Extract both legacy and new fields to ensure proper mapping
    const { title, meta_can_tag, meta_image, meta_title, canonical_url, og_image, ...rest } = dto;
    const result: Partial<SeoTag> = { ...rest };

    // 🌟 FIX: Use || instead of ?? so empty strings ("") trigger the fallback
    const effectiveTitle = meta_title || title;
    const effectiveCanonical = canonical_url || meta_can_tag;
    const effectiveOgImage = og_image || meta_image;

    if (effectiveTitle) result.meta_title = effectiveTitle;
    if (effectiveCanonical) result.canonical_url = effectiveCanonical;
    if (effectiveOgImage) result.og_image = effectiveOgImage;

    return result;
  }

  async create(createSeoTagDto: CreateSeoTagDto, user?: any): Promise<SeoTag> {
    const seoTag = this.seoTagRepository.create({
      ...this.normalizeSeoPayload(createSeoTagDto),
      status: resolveActiveStatus(createSeoTagDto?.status || 'active', user),
    });
    return await this.seoTagRepository.save(seoTag);
  }

  async update(id: number, updateSeoTagDto: UpdateSeoTagDto, user?: any): Promise<SeoTag> {
    const record = await this.findOne(id);
    Object.assign(record, {
      ...this.normalizeSeoPayload(updateSeoTagDto),
      status:
        updateSeoTagDto?.status !== undefined
          ? resolveActiveStatus(updateSeoTagDto.status, user)
          : record.status,
    });
    return await this.seoTagRepository.save(record);
  }

  async findAll(status?: string): Promise<SeoTag[]> {
    const whereCondition = status ? { status } : {};
    return await this.seoTagRepository.find({
      where: whereCondition,
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SeoTag> {
    const record = await this.seoTagRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`SEO Tag with ID ${id} not found`);
    return record;
  }

  async findByPageName(page_name: string): Promise<SeoTag> {
  // 1. Clean domain and trailing slashes
  let cleanPath = page_name.replace(/^https?:\/\/hcinterior\.in/, '');
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  const isHome = cleanPath === '' || cleanPath === '/' || cleanPath === '/home';

  if (isHome) {
    const homeRecord = await this.seoTagRepository.createQueryBuilder('seoTag')
      .where('seoTag.status = :status', { status: 'active' })
      .andWhere('(seoTag.page_name IN (:...homePaths))', {
        homePaths: ['/', '/home', 'https://hcinterior.in', 'https://hcinterior.in/']
      })
      .getOne();

    if (homeRecord) return homeRecord;
  }

  // 2. Prepare search path variations
  const withSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  const withoutSlash = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;

  // Build secondary fallback paths (e.g., converts /interior-designers-in-delhi -> /services-detail/delhi)
  let altPathWithSlash = withSlash;
  let altPathWithoutSlash = withoutSlash;

  if (withSlash.startsWith('/interior-designers-in-')) {
    const cityName = withSlash.replace('/interior-designers-in-', '');
    altPathWithSlash = `/services-detail/${cityName}`;
    altPathWithoutSlash = `services-detail/${cityName}`;
  } else if (withSlash.startsWith('/services-detail/')) {
    const cityName = withSlash.replace('/services-detail/', '');
    altPathWithSlash = `/interior-designers-in-${cityName}`;
    altPathWithoutSlash = `interior-designers-in-${cityName}`;
  }

  // 3. Query DB matching primary or mapped path variations
  const record = await this.seoTagRepository.createQueryBuilder('seoTag')
    .where('seoTag.status = :status', { status: 'active' })
    .andWhere(`(
      seoTag.page_name = :withSlash OR 
      seoTag.page_name = :withoutSlash OR 
      seoTag.page_name = :withSlashTrailing OR
      seoTag.page_name = :altPathWithSlash OR
      seoTag.page_name = :altPathWithoutSlash OR
      seoTag.page_name = :fullUrl
    )`, {
      withSlash,
      withoutSlash,
      withSlashTrailing: `${withSlash}/`,
      altPathWithSlash,
      altPathWithoutSlash,
      fullUrl: `https://hcinterior.in${withSlash}`
    })
    .getOne();

  if (!record) {
    throw new NotFoundException(`Active SEO Tag for page ${page_name} not found`);
  }

  return record;
}

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.seoTagRepository.softDelete(id);
  }

  async migrateLegacyData() {
    await this.seoTagRepository.query(`
      UPDATE seo_tag 
      SET meta_title = title 
      WHERE meta_title IS NULL AND title IS NOT NULL;
    `);
    
    await this.seoTagRepository.query(`
      UPDATE seo_tag 
      SET canonical_url = meta_can_tag 
      WHERE canonical_url IS NULL AND meta_can_tag IS NOT NULL;
    `);

    // 🌟 FIX: Removed the query targeting the 'title' column since it was dropped from the entity.
    
    return { success: true, message: "All legacy SEO data successfully migrated!" };
  }
}




// old file clone from github
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { SeoTag } from './entities/seo_tag.entity';
// import { CreateSeoTagDto } from './dto/create-seo_tag.dto';
// import { UpdateSeoTagDto } from './dto/update-seo_tag.dto';
// import { resolveActiveStatus } from '../auth/utils/cms-access.util';

// @Injectable()
// export class SeoTagService {
//   constructor(
//     @InjectRepository(SeoTag)
//     private readonly seoTagRepository: Repository<SeoTag>,
//   ) {}

//   async create(createSeoTagDto: CreateSeoTagDto, user?: any): Promise<SeoTag> {
//     const seoTag = this.seoTagRepository.create({
//       ...createSeoTagDto,
//       status: resolveActiveStatus(createSeoTagDto?.status || 'inactive', user),
//     });
//     return await this.seoTagRepository.save(seoTag);
//   }

//   async findAll(status?: string): Promise<SeoTag[]> {
//     const whereCondition = status ? { status } : {};
//     return await this.seoTagRepository.find({
//       where: whereCondition,
//       order: { id: 'DESC' },
//     });
//   }

//   async findOne(id: number): Promise<SeoTag> {
//     const record = await this.seoTagRepository.findOne({ where: { id } });
//     if (!record) throw new NotFoundException(`SEO Tag with ID ${id} not found`);
//     return record;
//   }

//   // 🌟 Smart matching to handle full URLs like "https://hcinterior.in"
//   async findByPageName(page_name: string): Promise<SeoTag> {
//     // Check if the requested route is the home page
//     const isHome = page_name === '/' || page_name === '/home' || page_name === 'https://hcinterior.in' || page_name === 'https://hcinterior.in/';

//     const queryBuilder = this.seoTagRepository.createQueryBuilder('seoTag')
//       .where('seoTag.status = :status', { status: 'active' });

//     if (isHome) {
//       // For the home page, match any of these database variations
//       queryBuilder.andWhere('(seoTag.page_name = :home1 OR seoTag.page_name = :home2 OR seoTag.page_name = :home3 OR seoTag.page_name = :home4)', {
//         home1: '/',
//         home2: '/home',
//         home3: 'https://hcinterior.in',
//         home4: 'https://hcinterior.in/'
//       });
//     } else {
//       // For other pages, strip any domain just in case, and prepare variations
//       const cleanPath = page_name.replace(/^https?:\/\/hcinterior\.in/, '');
//       const withSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
//       const withoutSlash = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
//       const fullUrl = `https://hcinterior.in${withSlash}`;

//       // Match /about-us OR about-us OR https://hcinterior.in/about-us
//       queryBuilder.andWhere('(seoTag.page_name = :withSlash OR seoTag.page_name = :withoutSlash OR seoTag.page_name = :fullUrl)', {
//         withSlash,
//         withoutSlash,
//         fullUrl
//       });
//     }

//     const record = await queryBuilder.getOne();

//     if (!record) throw new NotFoundException(`Active SEO Tag for page ${page_name} not found`);
//     return record;
//   }

//   async update(id: number, updateSeoTagDto: UpdateSeoTagDto, user?: any): Promise<SeoTag> {
//     const record = await this.findOne(id);
//     Object.assign(record, {
//       ...updateSeoTagDto,
//       status:
//         updateSeoTagDto?.status !== undefined
//           ? resolveActiveStatus(updateSeoTagDto.status, user)
//           : record.status,
//     });
//     return await this.seoTagRepository.save(record);
//   }

//   async remove(id: number): Promise<void> {
//     const record = await this.findOne(id);
//     await this.seoTagRepository.softDelete(id);
//   }


//   // Add this method anywhere inside the SeoTagService class
//   async migrateLegacyData() {
//     await this.seoTagRepository.query(`
//       UPDATE seo_tag 
//       SET meta_title = title 
//       WHERE meta_title IS NULL AND title IS NOT NULL;
//     `);
    
//     await this.seoTagRepository.query(`
//       UPDATE seo_tag 
//       SET canonical_url = meta_can_tag 
//       WHERE canonical_url IS NULL AND meta_can_tag IS NOT NULL;
//     `);
    
//     return { success: true, message: "All legacy SEO data successfully migrated!" };
//   }
// }
