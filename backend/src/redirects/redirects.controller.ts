import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { AuthGuard } from '@nestjs/passport';
import { ensureCmsDeletePermission } from '../auth/utils/cms-access.util';

@Controller('redirects')
export class RedirectsController {
  constructor(private readonly redirectsService: RedirectsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createRedirectDto: CreateRedirectDto, @Request() req) {
    return this.redirectsService.create(createRedirectDto, req.user);
  }

  // Endpoint for handling CSV Bulk Uploads
  @UseGuards(AuthGuard('jwt'))
  @Post('bulk')
  createBulk(@Body() createRedirectDtos: CreateRedirectDto[], @Request() req) {
    return this.redirectsService.createBulk(createRedirectDtos, req.user);
  }

  // Check whether a custom URL mapping is available.
@UseGuards(AuthGuard('jwt'))
@Get('check')
check(
  @Query('old_url') oldUrl: string,
  @Query('new_url') newUrl: string,
  @Query('excludeId') excludeId?: string,
) {
  return this.redirectsService.checkMapping(
    oldUrl,
    newUrl,
    excludeId ? Number(excludeId) : undefined,
  );
}

  @Get()
  findAll() {
    return this.redirectsService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.redirectsService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.redirectsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return this.redirectsService.update(+id, updateData, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    ensureCmsDeletePermission(req.user);
    return this.redirectsService.remove(+id);
  }
}
