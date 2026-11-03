// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
// import { SlugEditService } from './slug-edit.service';
// import { CreateSlugEditDto } from './dto/create-slug-edit.dto';
// import { UpdateSlugEditDto } from './dto/update-slug-edit.dto';
// import { baseFor, slugify } from './slug-edit.constants';

// @Controller('slug-edit')
// export class SlugEditController {
//   constructor(private readonly service: SlugEditService) {}

//   // ---- PUBLIC (used by the website middleware) ----
//   @Get('resolve')
//   resolve(@Query('path') path: string) { return this.service.resolvePath(path); }
  
//   @Get('map')
// map(@Query('entityType') entityType: string) { return this.service.slugMap(entityType); }

//   @Get('by-entity')
//   byEntity(@Query('entityType') entityType: string, @Query('entityId', ParseIntPipe) entityId: number) {
//     return this.service.byEntity(entityType, entityId);
//   }

//   // ---- ADMIN: add your existing auth guard from src/auth, e.g. @UseGuards(JwtAuthGuard) ----
//   @Get('types')
//   types() { return this.service.types(); }

//   @Get('check')
//   async check(
//     @Query('entityType') entityType: string,
//     @Query('slug') slug: string,
//     @Query('entityId') entityId?: string,
//     @Query('excludeId') excludeId?: string,
//   ) {
//     const clean = slugify(slug || '');
//     const available =
//       !!baseFor(entityType) &&
//       (await this.service.isAvailable(entityType, clean, entityId ? +entityId : undefined, excludeId ? +excludeId : undefined));
//     return { slug: clean, available };
//   }

//   @Get()
//   list(@Query('entityType') entityType?: string) { return this.service.list(entityType); }

//   @Post()
//   create(@Body() dto: CreateSlugEditDto) { return this.service.create(dto); }

//   @Patch(':id')
//   update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSlugEditDto) { return this.service.update(id, dto); }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
// }




import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ensureCmsDeletePermission } from '../auth/utils/cms-access.util';
import { SlugEditService } from './slug-edit.service';
import { CreateSlugEditDto } from './dto/create-slug-edit.dto';
import { UpdateSlugEditDto } from './dto/update-slug-edit.dto';
import { baseFor, slugify } from './slug-edit.constants';

@Controller('slug-edit')
export class SlugEditController {
  constructor(private readonly service: SlugEditService) {}

  // ---- PUBLIC (used by the website middleware) ----
  @Get('resolve')
  resolve(@Query('path') path: string) { return this.service.resolvePath(path); }
  
  @Get('map')
map(@Query('entityType') entityType: string) { return this.service.slugMap(entityType); }

  @Get('by-entity')
  byEntity(@Query('entityType') entityType: string, @Query('entityId', ParseIntPipe) entityId: number) {
    return this.service.byEntity(entityType, entityId);
  }

  // ---- ADMIN: add your existing auth guard from src/auth, e.g. @UseGuards(JwtAuthGuard) ----
  @UseGuards(AuthGuard('jwt'))
  @Get('types')
  types() { return this.service.types(); }

  @UseGuards(AuthGuard('jwt'))
  @Get('check')
  async check(
    @Query('entityType') entityType: string,
    @Query('slug') slug: string,
    @Query('entityId') entityId?: string,
    @Query('excludeId') excludeId?: string,
  ) {
    const clean = slugify(slug || '');
    const available =
      !!baseFor(entityType) &&
      (await this.service.isAvailable(entityType, clean, entityId ? +entityId : undefined, excludeId ? +excludeId : undefined));
    return { slug: clean, available };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  list(@Query('entityType') entityType?: string) { return this.service.list(entityType); }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateSlugEditDto, @Req() req: any) { return this.service.create(dto, req.user); }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSlugEditDto, @Req() req: any) { return this.service.update(id, dto, req.user); }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    ensureCmsDeletePermission(req.user);
    return this.service.remove(id);
  }
}




