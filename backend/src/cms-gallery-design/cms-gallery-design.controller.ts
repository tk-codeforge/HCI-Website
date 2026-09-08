import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,UploadedFile, Query } from '@nestjs/common';
import { CmsGalleryDesignService } from './cms-gallery-design.service';
import { CreateCmsGalleryDesignDto } from './dto/create-cms-gallery-design.dto';
import { UpdateCmsGalleryDesignDto } from './dto/update-cms-gallery-design.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('cms-gallery-design')
export class CmsGalleryDesignController {
  constructor(private readonly cmsGalleryDesignService: CmsGalleryDesignService) {}

  @Post('manage-banner')
  @UseInterceptors(FileInterceptor('banner_image'))
  async create(
    @Body() createCmsGalleryDesignDto: CreateCmsGalleryDesignDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('File is not uploaded');
    }
    const imagePath = file.path;
    return this.cmsGalleryDesignService.create(createCmsGalleryDesignDto, imagePath);
  }

  @UseInterceptors(FileFieldsInterceptor([
  { name: 'image', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 },
]))

  @Get()
  findAll() {
    return this.cmsGalleryDesignService.findAll();
  }

  @Get('manage-banner')
getManageBanner(@Query('key') key?: string) {
  return this.cmsGalleryDesignService.getManageBanner(key);
}

@Patch('manage-banner')
@UseInterceptors(FileInterceptor('banner_image'))
async updateManageBanner(
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
   @Query('key') key?: string,
) {
  const imagePath = file ? file.path : null;
  return this.cmsGalleryDesignService.updateManageBanner(body, imagePath, key);
}

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() updateCmsGalleryDesignDto: UpdateCmsGalleryDesignDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? file.path : null;
    return this.cmsGalleryDesignService.update(+id, updateCmsGalleryDesignDto, imagePath);
  }

}
