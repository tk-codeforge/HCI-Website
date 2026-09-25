import { Injectable } from '@nestjs/common';
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

  async create(createCmsExperienceCenterDto: CreateCmsExperienceCenterDto, imageName: string): Promise<CmsExperienceCenter> {
    // const imageName = basename(imagePath); 
    const newRecord = this.cmsExperienceCenterRepository.create({
      ...createCmsExperienceCenterDto,
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

async findAll() {
  const centers = await this.cmsExperienceCenterRepository.find();
  return centers.map(center => this.formatRecord(center));
}

async findOne(id: number) {
  const center = await this.cmsExperienceCenterRepository.findOne({ where: { id } });
  return this.formatRecord(center);
}

  async update(id: number, updateCmsExperienceCenterDto: UpdateCmsExperienceCenterDto, imageName: string | null) {
    const existingRecord = await this.cmsExperienceCenterRepository.findOne({ where: { id } });
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
  const existing = await this.cmsExperienceCenterRepository.findOne({ where: { id } });
  if (!existing) throw new Error('Record not found');
  await this.cmsExperienceCenterRepository.delete(id);
  return { deleted: true };
}
}
