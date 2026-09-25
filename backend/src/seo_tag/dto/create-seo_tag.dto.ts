import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateSeoTagDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    meta_title?: string;

    @IsString()
    @IsOptional()
    meta_description?: string;

    @IsString()
    @IsOptional()
    page_name?: string;

    @IsString()
    @IsOptional()
    meta_can_tag?: string;

    @IsString()
    @IsOptional()
    canonical_url?: string;

    @IsString()
    @IsOptional()
    keywords?: string;

    @IsString()
    @IsOptional()
    meta_image?: string;

    // --- NEW FIELDS ---
    @IsString()
    @IsOptional()
    meta_robots?: string;

    @IsString()
    @IsOptional()
    og_image?: string;
    // ------------------

    @IsBoolean()
    @IsOptional()
    include_in_sitemap?: boolean;

    @IsString()
    @IsOptional()
    sitemap_change_frequency?: string;

    @IsString()
    @IsOptional()
    sitemap_priority?: string;

    @IsEnum(['active', 'inactive'])
    @IsOptional()
    status?: string;
}


// old file clone from github
// import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

// export class CreateSeoTagDto {
//     @IsString()
//     @IsOptional()
//     title?: string;

//     @IsString()
//     @IsOptional()
//     meta_description?: string;

//     @IsString()
//     @IsOptional()
//     page_name?: string;

//     @IsString()
//     @IsOptional()
//     meta_can_tag?: string;

//     @IsString()
//     @IsOptional()
//     meta_image?: string;

//     // --- NEW FIELDS ---
//     @IsString()
//     @IsOptional()
//     meta_robots?: string;

//     @IsString()
//     @IsOptional()
//     og_image?: string;
//     // ------------------

//     @IsBoolean()
//     @IsOptional()
//     include_in_sitemap?: boolean;

//     @IsString()
//     @IsOptional()
//     sitemap_change_frequency?: string;

//     @IsString()
//     @IsOptional()
//     sitemap_priority?: string;

//     @IsEnum(['active', 'inactive'])
//     @IsOptional()
//     status?: string;
// }
