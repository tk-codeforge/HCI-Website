import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperienceCenterAsset } from './entities/experience-center-asset.entity';
import { CreateExperienceCenterAssetDto } from './dto/create-experience-center-asset.dto';
import { UpdateExperienceCenterAssetDto } from './dto/update-experience-center-asset.dto';

@Injectable()
export class ExperienceCenterAssetService {
  constructor(
    @InjectRepository(ExperienceCenterAsset)
    private readonly repo: Repository<ExperienceCenterAsset>,
  ) {}

  // Store the filename only, serve back a full URL — same pattern already
  // used elsewhere in this codebase, just pointed at its own uploads
  // sub-folder so nothing can ever collide with other features.
  private formatRecord(row: ExperienceCenterAsset) {
    if (!row) return null;
    const baseUrl = `${process.env.BASE_URL}/uploads/experience-center-assets/`;
    return {
      id: row.id,
      parent_slug: row.parent_slug,
      page_type: row.page_type,
      created_at: row.created_at,
      updated_at: row.updated_at,
      // Shape the frontend already expects: img.child_content?.title / .image
      child_content: {
        title: row.title,
        image: row.image ? `${baseUrl}${row.image}` : null,
      },
    };
  }

  async create(dto: CreateExperienceCenterAssetDto, imageName: string) {
  if (!imageName) {
    throw new Error('File is not uploaded');
  }
  const record = this.repo.create({
    ...dto,
    image: imageName,
    parent_asset_id: dto.parent_asset_id ? +dto.parent_asset_id : null,
  });
  const saved = await this.repo.save(record);
  return this.formatRecord(saved);
}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  // Matches GET /experience-center-assets/:page_type/:parent_slug
  async findByTypeAndSlug(pageType: string, parentSlug: string) {
    const rows = await this.repo.find({
      where: { page_type: pageType, parent_slug: parentSlug },
      order: { id: 'ASC' }, // preserves upload order = card order on the public page
    });
    return rows.map((row) => this.formatRecord(row));
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Record not found');
    }
    return this.formatRecord(row);
  }

  async findChildren(parentAssetId: number) {
  const rows = await this.repo.find({
    where: { parent_asset_id: parentAssetId },
    order: { id: 'ASC' },
  });
  return rows.map((row) => this.formatRecord(row));
}
  

  async update(
  id: number,
  dto: UpdateExperienceCenterAssetDto,
  imageName: string | null,
) {
  const existing = await this.repo.findOne({ where: { id } });
  if (!existing) {
    throw new NotFoundException('Record not found');
  }

  if (imageName) {
    dto.image = imageName;
  }

  // dto.parent_asset_id arrives as a string from multipart form data;
  // the entity column is numeric, so convert before handing it to TypeORM.
  const payload: any = { ...dto };
  if (dto.parent_asset_id !== undefined) {
    payload.parent_asset_id = dto.parent_asset_id ? +dto.parent_asset_id : null;
  }

  await this.repo.update(id, payload);
  const updated = await this.repo.findOne({ where: { id } });
  return this.formatRecord(updated);
}

  async remove(id: number) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Record not found');
    }
    await this.repo.delete(id);
    return { deleted: true };
  }
}
