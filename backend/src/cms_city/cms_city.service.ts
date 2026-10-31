// import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCmsCityDto } from './dto/create-cms_city.dto';
import { UpdateCmsCityDto } from './dto/update-cms_city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CmsCity } from './entities/cms_city.entity';
import { Repository } from 'typeorm';

type CmsCityImageField =
  | 'location_image'
  | 'side_image'
  | 'banner_image'
  | 'mobile_banner_image'
  | 'project_image_1'
  | 'project_image_2'
  | 'project_image_3'
  | 'project_image_4'
  | 'project_image_5'
  | 'project_image_6';

type CmsCityImagePaths = Partial<
  Record<CmsCityImageField, string>
>;

@Injectable()
export class CmsCityService {
  constructor(
    @InjectRepository(CmsCity)
    private readonly cmsCityRepository: Repository<CmsCity>,
  ) {}

  private parseCitySettings(
  value?: string,
): Record<string, unknown> | null {
  if (value === undefined || value === null || value.trim() === '') {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new BadRequestException(
      'city_settings must contain valid JSON.',
    );
  }

  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new BadRequestException(
      'city_settings must be a JSON object.',
    );
  }

  return parsed as Record<string, unknown>;
}

  // async create(createCmsCityDto: CreateCmsCityDto, location_image: string | null, side_image: string | null, banner_image: string | null) {
  //   const cmsCity = this.cmsCityRepository.create({
  //     ...createCmsCityDto,
  //     location_image,
  //     side_image,
  //     banner_image,
  //   });
  //   return this.cmsCityRepository.save(cmsCity);
  // }

  async create(
  createCmsCityDto: CreateCmsCityDto,
  imagePaths: CmsCityImagePaths,
) {
  const cmsCity = this.cmsCityRepository.create({
    ...createCmsCityDto,

    city_settings: this.parseCitySettings(
      createCmsCityDto.city_settings,
    ),

    location_image: imagePaths.location_image ?? null,
    side_image: imagePaths.side_image ?? null,
    banner_image: imagePaths.banner_image ?? null,
    mobile_banner_image: imagePaths.mobile_banner_image ?? null,

    project_image_1: imagePaths.project_image_1 ?? null,
    project_image_2: imagePaths.project_image_2 ?? null,
    project_image_3: imagePaths.project_image_3 ?? null,
    project_image_4: imagePaths.project_image_4 ?? null,
    project_image_5: imagePaths.project_image_5 ?? null,
    project_image_6: imagePaths.project_image_6 ?? null,
  });

  return this.cmsCityRepository.save(cmsCity);
}

  async findAll() {
    const cities = await this.cmsCityRepository.find({ order: { id: 'DESC' } });
    const baseUrl = `${process.env.BASE_URL}/uploads/city/`;

    return cities.map(city => ({
      ...city,
      location_image: city.location_image ? `${baseUrl}${city.location_image}` : null,
      side_image: city.side_image ? `${baseUrl}${city.side_image}` : null,
      banner_image: city.banner_image ? `${baseUrl}${city.banner_image}` : null,

      mobile_banner_image: city.mobile_banner_image
  ? `${baseUrl}${city.mobile_banner_image}`
  : null,

project_image_1: city.project_image_1
  ? `${baseUrl}${city.project_image_1}`
  : null,

project_image_2: city.project_image_2
  ? `${baseUrl}${city.project_image_2}`
  : null,

project_image_3: city.project_image_3
  ? `${baseUrl}${city.project_image_3}`
  : null,

project_image_4: city.project_image_4
  ? `${baseUrl}${city.project_image_4}`
  : null,

project_image_5: city.project_image_5
  ? `${baseUrl}${city.project_image_5}`
  : null,

project_image_6: city.project_image_6
  ? `${baseUrl}${city.project_image_6}`
  : null,
    }));
  }

  async findOne(city_type: string) {
    const city = await this.cmsCityRepository.findOneBy({ city_type });
    if (!city) return null;

    const baseUrl = `${process.env.BASE_URL}/uploads/city/`;
    return {
      ...city,
      location_image: city.location_image ? `${baseUrl}${city.location_image}` : null,
      side_image: city.side_image ? `${baseUrl}${city.side_image}` : null,
      banner_image: city.banner_image ? `${baseUrl}${city.banner_image}` : null,

      mobile_banner_image: city.mobile_banner_image
  ? `${baseUrl}${city.mobile_banner_image}`
  : null,

project_image_1: city.project_image_1
  ? `${baseUrl}${city.project_image_1}`
  : null,

project_image_2: city.project_image_2
  ? `${baseUrl}${city.project_image_2}`
  : null,

project_image_3: city.project_image_3
  ? `${baseUrl}${city.project_image_3}`
  : null,

project_image_4: city.project_image_4
  ? `${baseUrl}${city.project_image_4}`
  : null,

project_image_5: city.project_image_5
  ? `${baseUrl}${city.project_image_5}`
  : null,

project_image_6: city.project_image_6
  ? `${baseUrl}${city.project_image_6}`
  : null,
    };
  }

  // async update(id: number, updateCmsCityDto: UpdateCmsCityDto, location_image: string | null, side_image: string | null, banner_image: string | null) {
  //   const updateData: Partial<UpdateCmsCityDto & { location_image: string; side_image: string; banner_image: string; }> = {
  //     ...updateCmsCityDto,
  //   };

  //   if (location_image) updateData.location_image = location_image;
  //   if (side_image) updateData.side_image = side_image;
  //   if (banner_image) updateData.banner_image = banner_image;

  //   await this.cmsCityRepository.update(id, updateData);
  //   return this.cmsCityRepository.findOneBy({ id });
  // }

  async update(
  id: number,
  updateCmsCityDto: UpdateCmsCityDto,
  imagePaths: CmsCityImagePaths,
) {
  const { city_settings, ...dtoFields } = updateCmsCityDto;

  const updateData: Partial<CmsCity> = {
    ...dtoFields,
    ...imagePaths,
  };

  if (city_settings !== undefined) {
    updateData.city_settings =
      this.parseCitySettings(city_settings);
  }

  await this.cmsCityRepository.update(id, updateData);

  return this.cmsCityRepository.findOneBy({ id });
}

  async updateSeoContent(id: number, seo_content: any) {
    const cityData = await this.cmsCityRepository.findOneBy({ id });
    if (!cityData) throw new Error(`City with id ${id} not found`);

    await this.cmsCityRepository.update(id, { seo_content });
    return { message: `SEO content updated` };
  }

  async duplicate(id: number) {
    const existingCity = await this.cmsCityRepository.findOneBy({ id });
    if (!existingCity) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    const newCityData = this.cmsCityRepository.create({
      ...existingCity,
      id: undefined, 
      city_type: `${existingCity.city_type}-copy-${Date.now()}`,
      main_title: `${existingCity.main_title} (Copy)`,
    });
    
    return await this.cmsCityRepository.save(newCityData);
  }

  remove(id: number) {
    return this.cmsCityRepository.delete(id);
  }
}