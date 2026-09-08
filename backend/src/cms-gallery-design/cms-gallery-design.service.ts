import { Injectable } from '@nestjs/common';
import { CreateCmsGalleryDesignDto } from './dto/create-cms-gallery-design.dto';
import { UpdateCmsGalleryDesignDto } from './dto/update-cms-gallery-design.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CmsGalleryDesign } from './entities/cms-gallery-design.entity';
import { Repository } from 'typeorm';
import { basename } from 'path';

@Injectable()
export class CmsGalleryDesignService {

  constructor(
    @InjectRepository(CmsGalleryDesign)
    private readonly cmsGalleryDesignRepository: Repository<CmsGalleryDesign>,
  ) {}




  async create(createCmsGalleryDesignDto: CreateCmsGalleryDesignDto, imagePath: string): Promise<CmsGalleryDesign> {
    const imageName = basename(imagePath); // Extract the filename from the path
    const newRecord = this.cmsGalleryDesignRepository.create({
      ...createCmsGalleryDesignDto,
      image: imageName,
    });
    return await this.cmsGalleryDesignRepository.save(newRecord);
  }

  async findAll() {
    const baseUrl = `${process.env.BASE_URL}/uploads/design-gallery/`;
    const designs = await this.cmsGalleryDesignRepository.find();

    return designs.map(design => ({
      ...design,
      image: design.image ? `${baseUrl}${design.image}` : null,
      banner_image: design.banner_image ? `${baseUrl}${design.banner_image}` : null,
    }));
  }


  async update(id: number, updateCmsGalleryDesignDto: UpdateCmsGalleryDesignDto, imagePath: string | null) {
    const existingRecord = await this.cmsGalleryDesignRepository.findOne({ where: { id } });
    if (!existingRecord) {
      throw new Error('Record not found');
    }

    if (imagePath) {
      const imageName = basename(imagePath); // Extract the filename from the path
      updateCmsGalleryDesignDto.image = imageName;
    }

    await this.cmsGalleryDesignRepository.update(id, updateCmsGalleryDesignDto);
    return this.cmsGalleryDesignRepository.findOne({ where: { id } });
  }

  async getManageBanner(bannerKey: string = 'design_gallery') {
  const baseUrl = `${process.env.BASE_URL}/uploads/design-gallery/`;
  let record = await this.cmsGalleryDesignRepository.findOne({
    where: { is_manage_banner: true, banner_key: bannerKey },
    // order: { id: 'ASC' },
  });

  if (!record) return null;

  return {
    id: record.id,
    banner_heading: record.banner_heading,
    banner_description: record.banner_description,
    banner_heading_tag: record.banner_heading_tag,
    banner_description_font_size: record.banner_description_font_size,
    banner_image: record.banner_image ? `${baseUrl}${record.banner_image}` : null,
  };
}

async updateManageBanner(dto: any, imagePath: string | null, bannerKey: string = 'design_gallery') {
  let record = await this.cmsGalleryDesignRepository.findOne({
    where: { is_manage_banner: true, banner_key: bannerKey },
  });

  // Auto-create a placeholder row on first-ever save, since title/description/
  // room_dimension/image are NOT NULL on this entity.
  if (!record) {
    record = this.cmsGalleryDesignRepository.create({
      title: 'Banner Config',
      description: 'Reserved record for banner management',
      room_dimension: 'N/A',
      image: 'placeholder.jpg',
      is_manage_banner: true,
      banner_key: bannerKey,
    });
    record = await this.cmsGalleryDesignRepository.save(record);
  }

  if (imagePath) {
    dto.banner_image = basename(imagePath);
  }

  if (dto.banner_description_font_size !== undefined) {
  dto.banner_description_font_size = parseInt(dto.banner_description_font_size, 10);
}

  await this.cmsGalleryDesignRepository.update(record.id, dto);
  return this.getManageBanner(bannerKey);
}

}
