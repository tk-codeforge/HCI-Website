import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { Express } from 'express';
import { ExperienceCenterAssetService } from './experience-center-asset.service';
import { CreateExperienceCenterAssetDto } from './dto/create-experience-center-asset.dto';
import { UpdateExperienceCenterAssetDto } from './dto/update-experience-center-asset.dto';

const UPLOAD_DIR = './uploads/experience-center-assets';

// Local, self-contained multer config with its own folder and its own
// route prefix ("experience-center-assets"), so this can never collide
// with the existing "cms-parent-child" controller, routes, or uploads.
const assetUploadInterceptor = FileInterceptor('image', {
  storage: diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
});

@Controller('experience-center-assets')
export class ExperienceCenterAssetController {
  constructor(
    private readonly experienceCenterAssetService: ExperienceCenterAssetService,
  ) {}

  // Matches: api.post(EP.children, formData) — used for both the video
  // upload (first time) and adding a new gallery image.
  @Post()
  @UseInterceptors(assetUploadInterceptor)
  async create(
    @Body() createExperienceCenterAssetDto: CreateExperienceCenterAssetDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.experienceCenterAssetService.create(
      createExperienceCenterAssetDto,
      file?.filename,
    );
  }

  @Get()
  findAll() {
    return this.experienceCenterAssetService.findAll();
  }

  @Get('by-id/:id')
findOne(@Param('id') id: number) {
  return this.experienceCenterAssetService.findOne(+id);
}

  @Get('gallery/:parent_asset_id')
findChildren(@Param('parent_asset_id') parentAssetId: number) {
  return this.experienceCenterAssetService.findChildren(+parentAssetId);
}

  // Matches: api.get(`${EP.children}/${CHILD_IMAGE_TYPE}/${slug}`)
  //      and api.get(`${EP.children}/${CHILD_VIDEO_TYPE}/${slug}`)
  @Get(':page_type/:parent_slug')
  findByTypeAndSlug(
    @Param('page_type') pageType: string,
    @Param('parent_slug') parentSlug: string,
  ) {
    return this.experienceCenterAssetService.findByTypeAndSlug(
      pageType,
      parentSlug,
    );
  }

  // Matches: api.patch(`${EP.children}/${video.id}`, formData) — replacing the video
  @Patch(':id')
  @UseInterceptors(assetUploadInterceptor)
  async update(
    @Param('id') id: number,
    @Body() updateExperienceCenterAssetDto: UpdateExperienceCenterAssetDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.experienceCenterAssetService.update(
      +id,
      updateExperienceCenterAssetDto,
      file ? file.filename : null,
    );
  }

  // Matches: api.delete(`${EP.children}/${img.id}`)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.experienceCenterAssetService.remove(+id);
  }
  
}
