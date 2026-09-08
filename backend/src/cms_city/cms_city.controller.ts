import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseIntPipe, UploadedFiles } from '@nestjs/common';
import { CmsCityService } from './cms_city.service';
import { CreateCmsCityDto } from './dto/create-cms_city.dto';
import { UpdateCmsCityDto } from './dto/update-cms_city.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('cms-city')
export class CmsCityController {
  constructor(private readonly cmsCityService: CmsCityService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'location_image', maxCount: 1 },
    { name: 'side_image', maxCount: 1 },
    { name: 'banner_image', maxCount: 1 },
  ]))
  async uploadFiles(
    @Body() createCmsCityDto: CreateCmsCityDto,
    @UploadedFiles() files: { location_image?: Express.Multer.File[], side_image?: Express.Multer.File[], banner_image?: Express.Multer.File[] },
  ) {
    const locationImagePath = files?.location_image ? files.location_image[0].filename : null;
    const sideImagePath = files?.side_image ? files.side_image[0].filename : null;
    const bannerImagePath = files?.banner_image ? files.banner_image[0].filename : null;

    return this.cmsCityService.create(createCmsCityDto, locationImagePath, sideImagePath, bannerImagePath);
  }

  @Get()
  findAll() {
    return this.cmsCityService.findAll();
  }

  @Get(':city_type')
  findOne(@Param('city_type') cityType: string) {
    return this.cmsCityService.findOne(cityType);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'location_image', maxCount: 1 },
    { name: 'side_image', maxCount: 1 },
    { name: 'banner_image', maxCount: 1 },
  ]))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCmsCityDto: UpdateCmsCityDto,
    @UploadedFiles() files: { location_image?: Express.Multer.File[], side_image?: Express.Multer.File[], banner_image?: Express.Multer.File[] }
  ) {
    const location_image = files?.location_image ? files.location_image[0].filename : null;
    const side_image = files?.side_image ? files.side_image[0].filename : null;
    const banner_image = files?.banner_image ? files.banner_image[0].filename : null;
    
    return this.cmsCityService.update(id, updateCmsCityDto, location_image, side_image, banner_image);
  }

  @Patch('seo-content/:id')
  async updateSeoContent(
    @Param('id', ParseIntPipe) id: number,
    @Body() seo_content: any
  ) {
    return this.cmsCityService.updateSeoContent(id, seo_content);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id', ParseIntPipe) id: number) {
    return this.cmsCityService.duplicate(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cmsCityService.remove(+id);
  }
}