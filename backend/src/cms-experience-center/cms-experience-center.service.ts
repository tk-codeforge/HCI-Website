import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCmsExperienceCenterDto } from './dto/create-cms-experience-center.dto';
import { UpdateCmsExperienceCenterDto } from './dto/update-cms-experience-center.dto';
import { CmsExperienceCenter } from './entities/cms-experience-center.entity';
// import { basename } from 'path';

@Injectable()
export class CmsExperienceCenterService {
  constructor(
    @InjectRepository(CmsExperienceCenter)
    private readonly cmsExperienceCenterRepository: Repository<CmsExperienceCenter>,
  ) {}

  // async create(createCmsExperienceCenterDto: CreateCmsExperienceCenterDto, imageName: string): Promise<CmsExperienceCenter> {
  //   // const imageName = basename(imagePath); 
  //   const newRecord = this.cmsExperienceCenterRepository.create({
  //     ...createCmsExperienceCenterDto,
  //     image: imageName,
  //   });
  //   return await this.cmsExperienceCenterRepository.save(newRecord);
  // }

async create(dto: CreateCmsExperienceCenterDto, imageName: string | null) {
  const newRecord = this.cmsExperienceCenterRepository.create({
    ...dto,
    image: imageName,
  });
  return await this.cmsExperienceCenterRepository.save(newRecord);
}

  // async findAll() {
  //   const baseUrl = `${process.env.BASE_URL}/uploads/experience-center/`;
  //   const centers = await this.cmsExperienceCenterRepository.find();

  //   return centers.map(center => ({
  //     ...center,
  //     image: center.image ? `${baseUrl}${center.image}` : null,
  //   }));
  // }

  // findOne(id: number) {
  //   return this.cmsExperienceCenterRepository.findOne({ where: { id } });
  // }

  private formatRecord(center: CmsExperienceCenter) {
  if (!center) return null;
  const baseUrl = `${process.env.BASE_URL}/uploads/experience-center/`;
  return {
    ...center,
    image: center.image ? `${baseUrl}${center.image}` : null,
  };
}

private slugify(text = '') {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async findBySlug(slug: string) {
  const centers = await this.cmsExperienceCenterRepository.find({ where: { is_active: true } });
  const match = centers.find(
    (c) => `experience-center-${this.slugify(c.title)}` === slug,
  );
  if (!match) throw new NotFoundException('Experience center not found');
  return this.formatRecord(match);
}

async findAll() {
  // const centers = await this.cmsExperienceCenterRepository.find();
  const centers = await this.cmsExperienceCenterRepository.find({ where: { is_active: true } });
  return centers.map(center => this.formatRecord(center));
}

async findOne(id: number) {
  const center = await this.cmsExperienceCenterRepository.findOne({ where: { id, is_active: true } });
  return this.formatRecord(center);
}

  async update(id: number, updateCmsExperienceCenterDto: UpdateCmsExperienceCenterDto, imageName: string | null) {
    const existingRecord = await this.cmsExperienceCenterRepository.findOne({ where: { id, is_active: true } });
    if (!existingRecord) {
      throw new Error('Record not found');
    }

    if (imageName) {
      // const imageName = basename(imagePath); 
      updateCmsExperienceCenterDto.image = imageName;
    }

    await this.cmsExperienceCenterRepository.update(id, updateCmsExperienceCenterDto);
    // return this.cmsExperienceCenterRepository.findOne({ where: { id } });

    const updatedRecord = await this.cmsExperienceCenterRepository.findOne({ where: { id } });
  return this.formatRecord(updatedRecord);
  }

  async remove(id: number) {
  const existing = await this.cmsExperienceCenterRepository.findOne({ where: { id, is_active: true } });
  if (!existing) throw new NotFoundException('Record not found');
  await this.cmsExperienceCenterRepository.update(id, { is_active: false });
  return { deleted: true };
}

async findDeleted() {
  const rows = await this.cmsExperienceCenterRepository.find({ where: { is_active: false } });
  return rows.map((r) => this.formatRecord(r));
}

async restore(id: number) {
  const row = await this.cmsExperienceCenterRepository.findOne({ where: { id } });
  if (!row) throw new NotFoundException('Record not found');
  await this.cmsExperienceCenterRepository.update(id, { is_active: true });
  return this.formatRecord(await this.cmsExperienceCenterRepository.findOne({ where: { id } }));
}
}
