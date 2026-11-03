import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SlugSetting } from '../slug-edit/entities/slug-setting.entity';

import { canonicalSlugPath } from '../slug-edit/slug-edit.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redirect } from './entity/redirect.entity';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { resolveBooleanPublishState } from '../auth/utils/cms-access.util';

@Injectable()
export class RedirectsService {
  // constructor(
  //   @InjectRepository(Redirect)
  //   private readonly redirectRepository: Repository<Redirect>,
  // ) {}

  constructor(
  @InjectRepository(Redirect)
  private readonly redirectRepository: Repository<Redirect>,

  @InjectRepository(SlugSetting)
  private readonly slugRepository: Repository<SlugSetting>,
) {}

  private formatUrl(url: string): string {
    if (!url || url === '/') return '/';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (!url.startsWith('/')) return `/${url}`;
    return url;
  }

  private readonly siteOrigin = 'https://hcinterior.in';

private async formatInternalUrl(input: string): Promise<string> {
  if (!input || typeof input !== 'string') {
    throw new BadRequestException('URL is required');
  }

  const value = input.trim();

  if (
    !value.startsWith('/') ||
    value.startsWith('//')
  ) {
    throw new BadRequestException(
      'Enter an internal URL beginning with /',
    );
  }

  const parsed = new URL(value, this.siteOrigin);

  if (parsed.origin !== this.siteOrigin) {
    throw new BadRequestException(
      'Only internal URLs are allowed',
    );
  }

  const pathname = parsed.pathname.replace(/\/{2,}/g, '/');

  const firstSegment = pathname.split('/').filter(Boolean)[0]?.toLowerCase();

  const protectedPrefixes = ['/cms', '/dashboard'];

  if (protectedPrefixes.includes(`/${firstSegment}`)) {
    throw new BadRequestException(
      'CMS and dashboard URLs cannot be changed',
    );
  }

  if (
    pathname.startsWith('/api/') ||
    pathname === '/api' ||
    pathname.startsWith('/_next/') ||
    pathname === '/_next'
  ) {
    throw new BadRequestException(
      'System URLs cannot be changed',
    );
  }

  const normalizedPath =
    pathname.length > 1
      ? pathname.replace(/\/$/, '')
      : '/';

  return `${normalizedPath}${parsed.search}`;
}

private getPathname(url: string): string {
  const pathname = new URL(url, this.siteOrigin).pathname;

  return pathname
    .replace(/\/{2,}/g, '/')
    .replace(/\/$/, '')
    .toLowerCase() || '/';
}

private async checkDuplicateMapping(
  oldUrl: string,
  newUrl: string,
  excludeId?: number,
): Promise<void> {

  if (oldUrl.toLowerCase() === newUrl.toLowerCase()) {
    throw new BadRequestException(
      'Old URL and new URL cannot be the same',
    );
  }

  const query = this.redirectRepository
    .createQueryBuilder('redirect')
    .where('redirect.old_url = :oldUrl', { oldUrl });

  if (excludeId !== undefined) {
    query.andWhere('redirect.id != :excludeId', { excludeId });
  }

  if (await query.getCount()) {
    throw new ConflictException(
      'This old URL is already configured',
    );
  }
}

private async checkSlugConflict(
  oldUrl: string,
  newUrl: string,
): Promise<void> {

  const requestedPaths = new Set([
    this.getPathname(oldUrl),
    this.getPathname(newUrl),
  ]);

  const slugRecords = await this.slugRepository.find();

  for (const record of slugRecords) {
    const canonical = canonicalSlugPath(
      record.entityType,
      record.slug,
    );

    if (
      canonical &&
      requestedPaths.has(this.getPathname(canonical))
    ) {
      throw new ConflictException(
        `This URL is already assigned to a gallery slug: ${canonical}`,
      );
    }
  }
}

async checkMapping(
  oldUrlInput: string,
  newUrlInput: string,
  excludeId?: number,
) {
  try {
    const oldUrl = await this.formatInternalUrl(oldUrlInput);
    const newUrl = await this.formatInternalUrl(newUrlInput);

    await this.checkDuplicateMapping(
      oldUrl,
      newUrl,
      excludeId,
    );

    await this.checkSlugConflict(
      oldUrl,
      newUrl,
    );

    return {
      available: true,
      old_url: oldUrl,
      new_url: newUrl,
    };

  } catch (error) {

    if (
      error instanceof ConflictException ||
      error instanceof BadRequestException
    ) {
      return {
        available: false,
        message: error.message,
      };
    }

    throw error;
  }
}

  // async create(createRedirectDto: CreateRedirectDto, user?: any) {
  //   createRedirectDto.old_url = this.formatUrl(createRedirectDto.old_url);
  //   createRedirectDto.new_url = this.formatUrl(createRedirectDto.new_url);
  //   const resolvedActiveState = resolveBooleanPublishState(
  //     createRedirectDto.is_active ?? true,
  //     user,
  //   );
    
  //   const redirect = this.redirectRepository.create({
  //     ...createRedirectDto,
  //     is_active:
  //       typeof resolvedActiveState === 'boolean'
  //         ? resolvedActiveState
  //         : createRedirectDto.is_active ?? true,
  //   });
  //   return await this.redirectRepository.save(redirect);
  // }

  async create(createRedirectDto: CreateRedirectDto, user?: any) {

  const is_url_rewrite =
    createRedirectDto.is_url_rewrite === true;

  const old_url = is_url_rewrite
    ? await this.formatInternalUrl(createRedirectDto.old_url)
    : this.formatUrl(createRedirectDto.old_url);

  const new_url = is_url_rewrite
    ? await this.formatInternalUrl(createRedirectDto.new_url)
    : this.formatUrl(createRedirectDto.new_url);

  const status_code = Number(
    createRedirectDto.status_code ?? 301,
  );

  if (![301, 302].includes(status_code)) {
    throw new BadRequestException(
      'Redirect type must be 301 or 302',
    );
  }

  await this.checkDuplicateMapping(
    old_url,
    new_url,
  );

  if (is_url_rewrite) {
    await this.checkSlugConflict(
      old_url,
      new_url,
    );
  }

  const resolvedActiveState = resolveBooleanPublishState(
    createRedirectDto.is_active ?? true,
    user,
  );

  const redirect = this.redirectRepository.create({
    old_url,
    new_url,
    status_code,
    is_active:
      typeof resolvedActiveState === 'boolean'
        ? resolvedActiveState
        : createRedirectDto.is_active ?? true,
    is_url_rewrite,
  });

  return await this.redirectRepository.save(redirect);
}

  // --- BULK REDIRECT SUPPORT ---
  // async createBulk(redirectsData: CreateRedirectDto[], user?: any) {
  //   const formattedRedirects = redirectsData.map(item => {
  //     const resolvedActiveState = resolveBooleanPublishState(true, user);
  //     return this.redirectRepository.create({
  //       old_url: this.formatUrl(item.old_url),
  //       new_url: this.formatUrl(item.new_url),
  //       status_code: Number(item.status_code) || 301,
  //       is_active: typeof resolvedActiveState === 'boolean' ? resolvedActiveState : true,
  //     });
  //   });
  //   return await this.redirectRepository.save(formattedRedirects);
  // }


  async createBulk(
  redirectsData: CreateRedirectDto[],
  user?: any,
) {
  const formattedRedirects: Redirect[] = [];

  const batchOldUrls = new Set<string>();

  for (const item of redirectsData) {

    const is_url_rewrite =
      item.is_url_rewrite === true;

    const old_url = is_url_rewrite
      ? await this.formatInternalUrl(item.old_url)
      : this.formatUrl(item.old_url);

    const new_url = is_url_rewrite
      ? await this.formatInternalUrl(item.new_url)
      : this.formatUrl(item.new_url);

    const status_code = Number(item.status_code) || 301;

    if (![301, 302].includes(status_code)) {
      throw new BadRequestException(
        'Redirect type must be 301 or 302',
      );
    }

    if (batchOldUrls.has(old_url)) {
      throw new ConflictException(
        `Duplicate URL in import: ${old_url}`,
      );
    }

    batchOldUrls.add(old_url);

    await this.checkDuplicateMapping(old_url, new_url);

    if (is_url_rewrite) {
      await this.checkSlugConflict(old_url, new_url);
    }

    const resolvedActiveState =
      resolveBooleanPublishState(true, user);

    formattedRedirects.push(
      this.redirectRepository.create({
        old_url,
        new_url,
        status_code,
        is_active:
          typeof resolvedActiveState === 'boolean'
            ? resolvedActiveState
            : true,
        is_url_rewrite,
      }),
    );
  }

  return await this.redirectRepository.save(
    formattedRedirects,
  );
}

  async findAll() {
    return await this.redirectRepository.find({ order: { created_at: 'DESC' } });
  }

  async findAllActive() {
    return await this.redirectRepository.find({ where: { is_active: true } });
  }

  async findOne(id: number) {
    const redirect = await this.redirectRepository.findOne({ where: { id } });
    if (!redirect) throw new NotFoundException(`Redirect ID ${id} not found`);
    return redirect;
  }

  // async update(id: number, updateData: any, user?: any) {
  //   const redirect = await this.findOne(id);
  //   if (updateData.old_url) updateData.old_url = this.formatUrl(updateData.old_url);
  //   if (updateData.new_url) updateData.new_url = this.formatUrl(updateData.new_url);
  //   if (updateData.is_active !== undefined) {
  //     const resolvedActiveState = resolveBooleanPublishState(updateData.is_active, user);
  //     updateData.is_active =
  //       typeof resolvedActiveState === 'boolean'
  //         ? resolvedActiveState
  //         : updateData.is_active;
  //   }

  //   Object.assign(redirect, updateData);
  //   return await this.redirectRepository.save(redirect);
  // }

  async update(
  id: number,
  updateData: any,
  user?: any,
) {
  const redirect = await this.findOne(id);

  const is_url_rewrite =
    updateData.is_url_rewrite !== undefined
      ? updateData.is_url_rewrite === true
      : redirect.is_url_rewrite === true;

  const old_url = updateData.old_url !== undefined
    ? (
        is_url_rewrite
          ? await this.formatInternalUrl(updateData.old_url)
          : this.formatUrl(updateData.old_url)
      )
    : redirect.old_url;

  const new_url = updateData.new_url !== undefined
    ? (
        is_url_rewrite
          ? await this.formatInternalUrl(updateData.new_url)
          : this.formatUrl(updateData.new_url)
      )
    : redirect.new_url;

  const status_code = updateData.status_code !== undefined
    ? Number(updateData.status_code)
    : redirect.status_code;

  if (![301, 302].includes(status_code)) {
    throw new BadRequestException(
      'Redirect type must be 301 or 302',
    );
  }

  // Existing duplicate historical records are not blocked
  // when their old URL and redirect type remain unchanged.
  const skipDuplicateCheck =
    old_url === redirect.old_url &&
    is_url_rewrite === (redirect.is_url_rewrite === true);

  if (!skipDuplicateCheck) {
    await this.checkDuplicateMapping(
      old_url,
      new_url,
      id,
    );
  }

  if (is_url_rewrite) {
    await this.checkSlugConflict(
      old_url,
      new_url,
    );
  }

  if (updateData.is_active !== undefined) {

    const resolvedActiveState = resolveBooleanPublishState(
      updateData.is_active,
      user,
    );

    redirect.is_active =
      typeof resolvedActiveState === 'boolean'
        ? resolvedActiveState
        : updateData.is_active;
  }

  redirect.old_url = old_url;
  redirect.new_url = new_url;
  redirect.status_code = status_code;
  redirect.is_url_rewrite = is_url_rewrite;

  return await this.redirectRepository.save(redirect);
}

  async remove(id: number) {
    const redirect = await this.findOne(id);
    return await this.redirectRepository.remove(redirect);
  }
}
