import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCmsContentDto } from './dto/create-cms_content.dto';
import { UpdateCmsContentDto, UpdateCmsContentHomepageBannerDto, UpdateJsonContentChildImageDto } from './dto/update-cms_content.dto';
import { CmsContent, PageType } from './entities/cms_content.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { basename } from 'path';

@Injectable()
export class CmsContentService {
  constructor(
    @InjectRepository(CmsContent)
    private readonly cmsContentRepository: Repository<CmsContent>,
  ) {}

  // ==========================================
  // SHARED OPTIMIZATION HELPERS
  // ==========================================

  private parseJsonData(data: any, fallback: any = {}): any {
    if (!data) return fallback;
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch { return fallback; }
    }
    return data;
  }

  private normalizeImageUrl(image: any, baseUrl: string): string | null {
    if (!image || typeof image !== 'string' || image.trim() === '') return null;
    if (image.startsWith('http') || image.startsWith('data:') || image.startsWith('/') || image.includes(' ') || !image.includes('.')) {
      return image;
    }
    return `${baseUrl}${basename(image)}`;
  }

  private extractIndices(indicesData: any): number[] {
    if (!indicesData) return [];
    if (typeof indicesData === 'string') {
      try { return JSON.parse(indicesData); } catch { return []; }
    }
    return Array.isArray(indicesData) ? indicesData : [];
  }

  // ==========================================
  // HYDRATION FUNCTIONS
  // ==========================================

  private hydrateHowItWorksContent(jsonContent: any, baseUrl: string) {
    const empty = {
      bannerHeading: '', bannerHeadingColor: '#ffffff',
      bannerDescription: '', bannerDescriptionColor: '#ffffff',
      bg_image: null, steps: [],
    };

    let parsed = this.parseJsonData(jsonContent, empty);
    if (Array.isArray(parsed)) parsed = { ...empty, steps: parsed };
    if (!parsed || typeof parsed !== 'object') return empty;

    parsed.bg_image = this.normalizeImageUrl(parsed.bg_image, baseUrl);
    parsed.steps = Array.isArray(parsed.steps)
      ? parsed.steps.map((step, index) => ({
          ...step,
          image: this.normalizeImageUrl(step?.image, baseUrl),
          align: index % 2 === 0 ? 'left' : 'right',
        }))
      : [];

    return parsed;
  }

  private hydrateWhatWeOfferPageContent(jsonContent: any, baseUrl: string) {
    let parsed = this.parseJsonData(jsonContent, jsonContent);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return parsed;

    parsed.bg_image = this.normalizeImageUrl(parsed.bg_image, baseUrl);
    if (Array.isArray(parsed.sections)) {
      parsed.sections = parsed.sections.map((section) => ({
        ...section,
        image: this.normalizeImageUrl(section?.image, baseUrl),
      }));
    }
    return parsed;
  }

  private hydrateCareerPageContent(jsonContent: any, baseUrl: string) {
  let parsed = this.parseJsonData(jsonContent, jsonContent);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return parsed;

  parsed.bg_image = this.normalizeImageUrl(parsed.bg_image, baseUrl);

  if (Array.isArray(parsed.sections)) {
    parsed.sections = parsed.sections.map((section) => ({
      ...section,
      image: this.normalizeImageUrl(section?.image, baseUrl),
    }));
  }
  return parsed;
}

  private cleanFooterContent(input: any): any {
    if (!input) return { is_empty: true };
    let parsed = this.parseJsonData(input, { is_empty: true });

    while (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.json_content !== undefined) {
      parsed = this.parseJsonData(parsed.json_content, parsed);
    }

    parsed = this.parseJsonData(parsed, { is_empty: true });
    let finalObj = parsed !== undefined && parsed !== null ? parsed : {};

    const hasVertical = finalObj.verticalColumns && finalObj.verticalColumns.length > 0;
    const hasHorizontal = finalObj.horizontalSections && finalObj.horizontalSections.length > 0;
    finalObj.is_empty = !(hasVertical || hasHorizontal);

    return finalObj;
  }

  private hydrateServicesPageContent(jsonContent: any, baseUrl: string) {
    let parsed = this.parseJsonData(jsonContent, jsonContent);
    if (!parsed) return parsed;

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      parsed.image = this.normalizeImageUrl(parsed.image, baseUrl);
      parsed.bg_image = this.normalizeImageUrl(parsed.bg_image, baseUrl);
      if (parsed.banner?.image) {
        parsed.banner.image = this.normalizeImageUrl(parsed.banner.image, baseUrl);
      }

      if (Array.isArray(parsed.services)) {
        parsed.services = parsed.services.map((service) => ({
          ...service,
          image: this.normalizeImageUrl(service?.image, baseUrl),
        }));
      }

      if (Array.isArray(parsed.blocks)) {
        parsed.blocks = parsed.blocks.map((block) => ({
          ...block,
          image: this.normalizeImageUrl(block?.image, baseUrl),
        }));
      }
    } else if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        ...item,
        image: this.normalizeImageUrl(item?.image, baseUrl),
      }));
    }

    return parsed;
  }

  private hydrateEstimateCardsContent(jsonContent: any, baseUrl: string) {
    let parsed = this.parseJsonData(jsonContent, jsonContent);
    if (!parsed) return parsed;

    if (typeof parsed === 'object' && !Array.isArray(parsed) && parsed.json_content) {
      parsed = parsed.json_content;
    }

    if (Array.isArray(parsed)) {
      return parsed.map((card) => ({
        ...card,
        image: this.normalizeImageUrl(card?.image, baseUrl),
        icon: this.normalizeImageUrl(card?.icon, baseUrl),
      }));
    }

    if (typeof parsed === 'object' && parsed.image) {
      parsed.image = this.normalizeImageUrl(parsed.image, baseUrl);
      if (parsed.icon) parsed.icon = this.normalizeImageUrl(parsed.icon, baseUrl);
    }

    return parsed;
  }

  private hydrateTheWayWeWorkContent(jsonContent: any, baseUrl: string) {
    if (!jsonContent || typeof jsonContent !== 'object') return jsonContent;

    if (jsonContent.bg_image) {
      jsonContent.bg_image = this.normalizeImageUrl(jsonContent.bg_image, baseUrl);
    }
    if (Array.isArray(jsonContent.cards)) {
      jsonContent.cards = jsonContent.cards.map((card) => ({
        ...card,
        icon: this.normalizeImageUrl(card?.icon, baseUrl),
      }));
    }
    return jsonContent;
  }

  private hydrateWhatWeOfferContent(jsonContent: any, baseUrl: string) {
    if (!jsonContent) return jsonContent;

    if (Array.isArray(jsonContent)) {
      return jsonContent.map((content) => ({
        ...content,
        image: this.normalizeImageUrl(content?.image, baseUrl),
      }));
    }

    if (typeof jsonContent === 'object') {
      jsonContent.image = this.normalizeImageUrl(jsonContent.image, baseUrl);
      jsonContent.bg_image = this.normalizeImageUrl(jsonContent.bg_image, baseUrl);
      if (Array.isArray(jsonContent.cards)) {
        jsonContent.cards = jsonContent.cards.map((card) => ({
          ...card,
          image: this.normalizeImageUrl(card?.image, baseUrl),
          icon: this.normalizeImageUrl(card?.icon, baseUrl),
        }));
      }
    }

    return jsonContent;
  }

  // ==========================================
  // CORE DB OPERATIONS
  // ==========================================

  create(page_type: PageType, createCmsContentDto: CreateCmsContentDto, imagePath: string) {
    let payload: any = createCmsContentDto;
    if (page_type === 'footer_content' as any || page_type === (PageType as any).FOOTER_CONTENT) {
      payload = this.cleanFooterContent(payload);
    }

    // Thank-you page: the CMS sends { json_content: "<json string>" }, so unwrap it before saving
    if (page_type === PageType.REDIRECT_THANK_YOU) {
      payload = this.parseJsonData(payload?.json_content, payload);
    }

    const newContent = this.cmsContentRepository.create({
      page_type,
      json_content: payload,
    });

    if (imagePath) {
      newContent.json_content.image = basename(imagePath);
    }
    return this.cmsContentRepository.save(newContent);
  }

  findAll() {
    return this.cmsContentRepository.find();
  }

  async updatePageContent(id: number, dto: any, formImagePath: string) {
    const existing = await this.cmsContentRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException(`Content not found`);

    let jsonContent = existing.json_content || {};
    
    // Migrate legacy raw array to an object wrapped under 'cards'
    if (Array.isArray(jsonContent)) {
        jsonContent = { cards: jsonContent };
    }

    jsonContent.main_heading = dto.main_heading;
    jsonContent.main_heading_tag = dto.main_heading_tag;
    jsonContent.main_description = dto.main_description;
    jsonContent.main_description_font_size = dto.main_description_font_size;
    jsonContent.form_bg_color = dto.form_bg_color;
    jsonContent.form_heading_color = dto.form_heading_color;
    jsonContent.form_heading = dto.form_heading;
    jsonContent.submit_button_text = dto.submit_button_text;
    jsonContent.submit_button_bg_color = dto.submit_button_bg_color;
    jsonContent.submit_button_color = dto.submit_button_color;
    
    if (dto.form_fields) {
        jsonContent.form_fields = typeof dto.form_fields === 'string' ? JSON.parse(dto.form_fields) : dto.form_fields;
    }
    
    if (formImagePath) {
        jsonContent.form_image = basename(formImagePath);
    }

    return this.cmsContentRepository.update(id, { json_content: jsonContent });
  }
  async findOne(page_type: PageType) {
    const contentDataArray = await this.cmsContentRepository.find({ where: { page_type }, order: { id: 'DESC' } });

    //   if ((!contentDataArray || contentDataArray.length === 0) && page_type === PageType.WARRANTY) {
    //   const created = await this.cmsContentRepository.save(
    //     this.cmsContentRepository.create({ page_type: PageType.WARRANTY, json_content: {} })
    //   );
    //   contentDataArray = [created];
    // }

    if (!contentDataArray || contentDataArray.length === 0) {
      return null;
    }

    const baseUrl = `${process.env.BASE_URL}/uploads/cms-content/`;

    // Unified mapping for both multi-row and single-row responses
    contentDataArray.forEach((contentData) => {
      let jsonContent = this.parseJsonData(contentData.json_content, {});

      switch (contentData.page_type) {
        case PageType.SERVICES_PAGE:
          contentData.json_content = this.hydrateServicesPageContent(jsonContent, baseUrl);
          break;
        case PageType.HOME_PAGE_THE_WAY_WE_WORK:
          contentData.json_content = this.hydrateTheWayWeWorkContent(jsonContent, baseUrl);
          break;
        case PageType.WHAT_WE_OFFER:
          contentData.json_content = this.hydrateWhatWeOfferContent(jsonContent, baseUrl);
          break;
        case PageType.HOW_IT_WORKS:
          contentData.json_content = this.hydrateHowItWorksContent(jsonContent, baseUrl);
          break;
        case PageType.REDIRECT_WHAT_WE_OFFER:
          contentData.json_content = this.hydrateWhatWeOfferPageContent(jsonContent, baseUrl);
          break;
        case PageType.HOME_PAGE_ESTIMATE_CARDS:
          contentData.json_content = this.hydrateEstimateCardsContent(jsonContent, baseUrl);
          break;
        case PageType.ABOUT_US:
        case PageType.HOME_PAGE_CONTENT_EVERY_SPACE:
        case PageType.HOME_PAGE_CONTENT_MEET_US:
        case PageType.CREATING_THE_HOME_OF_YOUR_DREAMS:
        case PageType.CREATING_THE_HOME_OF_YOUR_DREAMS_2:
          if (jsonContent) {
            jsonContent.mid_image = this.normalizeImageUrl(jsonContent.mid_image, baseUrl);
            if (contentData.page_type === PageType.ABOUT_US) {
      jsonContent.banner_image = this.normalizeImageUrl(jsonContent.banner_image, baseUrl);
    }
          }
          contentData.json_content = jsonContent;
          break;
        case PageType.ABOUT_US_SLIDER:
        case PageType.HOME_PAGE_CONTENT_WHY_CHOOSE_US:
          if (Array.isArray(jsonContent)) {
            jsonContent.forEach((content) => (content.image = this.normalizeImageUrl(content?.image, baseUrl)));
          } else if (jsonContent?.cards) {
            jsonContent.cards.forEach((card) => (card.image = this.normalizeImageUrl(card?.image, baseUrl)));
          }
          contentData.json_content = jsonContent;
          break;
        case PageType.HOMEPAGE_BANNER:
          if (Array.isArray(jsonContent)) {
            jsonContent.forEach((content) => {
              content.top_icon = this.normalizeImageUrl(content?.top_icon, baseUrl);
              content.banner_image = this.normalizeImageUrl(content?.banner_image, baseUrl);
              content.mobile_banner_image = this.normalizeImageUrl(content?.mobile_banner_image, baseUrl);
            });
          }
          contentData.json_content = jsonContent;
          break;
        case PageType.TEAM:
        case PageType.HOME_PAGE_CONTENT:
        case PageType.HOME_PAGE_CONTENT_WHAT_WE_ARE:
          if (jsonContent && typeof jsonContent === "object" && !Array.isArray(jsonContent)) {
            jsonContent.image = this.normalizeImageUrl(jsonContent.image, baseUrl);
          }
          contentData.json_content = jsonContent;
          break;
        case (PageType as any).FOOTER_CONTENT:
        case 'footer_content' as any:
          contentData.json_content = this.cleanFooterContent(contentData.json_content);
          break;

          case PageType.TEAM_PAGE_MEDIA:
  if (jsonContent && Array.isArray(jsonContent.items)) {
    jsonContent.items.forEach((item) => {
      item.url = this.normalizeImageUrl(item?.url, baseUrl);
    });
  }
  contentData.json_content = jsonContent;
  break;

  case PageType.SUSTAINABLE_FURNITURE:
          if (jsonContent?.cards && Array.isArray(jsonContent.cards)) {
            jsonContent.cards.forEach((card) => {
              card.image = this.normalizeImageUrl(card?.image, baseUrl);
            });
          }
          contentData.json_content = jsonContent;
          break;

          case PageType.REDIRECT_CAREER:
  contentData.json_content = this.hydrateCareerPageContent(jsonContent, baseUrl);
  break;

  case PageType.REFER_AND_EARN:
          if (Array.isArray(jsonContent)) {
            jsonContent.forEach((content) => (content.image = this.normalizeImageUrl(content?.image, baseUrl)));
          } else if (jsonContent) {
            if (Array.isArray(jsonContent.cards)) {
              jsonContent.cards.forEach((card) => (card.image = this.normalizeImageUrl(card?.image, baseUrl)));
            }
            if (jsonContent.form_image) {
              jsonContent.form_image = this.normalizeImageUrl(jsonContent.form_image, baseUrl);
            }
          }
          contentData.json_content = jsonContent;
          break;

                case PageType.HOME_PAGE_CONTENT_FURNITURE_FACTORY:
          if (jsonContent && typeof jsonContent === 'object') {
            jsonContent.topImage = this.normalizeImageUrl(jsonContent.topImage, baseUrl);
            jsonContent.image1 = this.normalizeImageUrl(jsonContent.image1, baseUrl);
            jsonContent.image2 = this.normalizeImageUrl(jsonContent.image2, baseUrl);
            jsonContent.video = this.normalizeImageUrl(jsonContent.video, baseUrl);   // 🆕 ADD THIS LINE
          }
          contentData.json_content = jsonContent;
          break;

        default:
          contentData.json_content = jsonContent;
      }
    });

    // if (contentDataArray.length > 1) {
    //   return contentDataArray;
    // } else {
    //   const contentData = contentDataArray[0];
    //   if (contentData.page_type === PageType.HOME_PAGE_CONTENT) return [contentData];
    //   return contentData;
    // }
        if (contentDataArray.length > 1) {
      return contentDataArray;
    } else {
      const contentData = contentDataArray[0];
      if (
        contentData.page_type === PageType.HOME_PAGE_CONTENT ||
        contentData.page_type === PageType.CANCELLATION_POLICY
      ) {
        return [contentData];
      }
      return contentData;
    }
    return contentDataArray[0];
  }

  async remove(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException(`Invalid content id: ${id}`);
    }
    const existing = await this.cmsContentRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`CMS content with id ${id} not found`);
    }
    return this.cmsContentRepository.delete(id);
  }

  update(id: number, updateCmsContentDto: UpdateCmsContentDto) {
    return this.cmsContentRepository.findOne({ where: { id } }).then((existingContent) => {
      let payload: any = updateCmsContentDto?.json_content !== undefined ? updateCmsContentDto.json_content : updateCmsContentDto;
      
      if (existingContent && (existingContent.page_type === 'footer_content' as any || existingContent.page_type === (PageType as any).FOOTER_CONTENT)) {
        payload = this.cleanFooterContent(payload);
      }
      
      return this.cmsContentRepository.update(id, { json_content: payload });
    });
  }

  async updateWithImage(id: number, updateCmsContentDto: any, imagePath: string, icons: Express.Multer.File[] = [], bannerImagePath?: string) {
    const exitingContent = await this.cmsContentRepository.findOne({ where: { id } });
    // if (!exitingContent) return null;
    if (!exitingContent) {
      throw new NotFoundException(`CMS content with id ${id} not found`);
    }

    if (exitingContent.page_type === 'footer_content' as any || exitingContent.page_type === (PageType as any).FOOTER_CONTENT) {
      const payload: any = updateCmsContentDto?.json_content !== undefined ? updateCmsContentDto.json_content : updateCmsContentDto;
      return this.cmsContentRepository.update(id, { json_content: this.cleanFooterContent(payload) });
    }

    let jsonContent = this.parseJsonData(updateCmsContentDto.json_content, updateCmsContentDto);
    let existingJsonContent = this.parseJsonData(exitingContent.json_content, {});

    switch (exitingContent.page_type) {
      case PageType.HOW_IT_WORKS: {
        if (Array.isArray(existingJsonContent)) existingJsonContent = { steps: existingJsonContent }; // legacy rows

        if (imagePath) {
          jsonContent.bg_image = basename(imagePath);
        } else if (typeof jsonContent.bg_image === 'string' && jsonContent.bg_image.startsWith('data:')) {
          jsonContent.bg_image = "";
        } else if (jsonContent.bg_image !== undefined && jsonContent.bg_image !== null) {
          jsonContent.bg_image = jsonContent.bg_image ? basename(jsonContent.bg_image) : "";
        } else {
          jsonContent.bg_image = existingJsonContent?.bg_image ? basename(existingJsonContent.bg_image) : "";
        }

        if (!jsonContent.steps && existingJsonContent?.steps) {
          jsonContent.steps = existingJsonContent.steps;
        }

        const imageIndices = this.extractIndices(updateCmsContentDto?.image_indices);

        if (Array.isArray(jsonContent.steps)) {
          jsonContent.steps.forEach((step, index) => {
            const fileSlot = imageIndices.indexOf(index);
            if (fileSlot !== -1 && icons && icons[fileSlot]) {
              step.image = basename(icons[fileSlot].filename);
            } else if (step.image === "") {
              step.image = "";
            } else if (existingJsonContent?.steps?.[index]?.image) {
              step.image = basename(existingJsonContent.steps[index].image);
            } else if (step.image) {
              step.image = basename(step.image);
            }
          });
        }
        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }

      case PageType.SERVICES_PAGE: {
        if (!jsonContent.services && existingJsonContent?.services) jsonContent.services = existingJsonContent.services;
        if (!jsonContent.blocks && existingJsonContent?.blocks) jsonContent.blocks = existingJsonContent.blocks;

        if (imagePath) {
          jsonContent.banner = jsonContent.banner || {};
          jsonContent.banner.image = basename(imagePath);
          jsonContent.bg_image = basename(imagePath);
          jsonContent.image = basename(imagePath); 
        } else if (updateCmsContentDto?.remove_image === 'true') {
          jsonContent.bg_image = "";
          jsonContent.image = "";
          if (jsonContent.banner) jsonContent.banner.image = "";
        } else {
          jsonContent.bg_image = existingJsonContent?.bg_image || jsonContent.bg_image || "";
          jsonContent.image = existingJsonContent?.image || jsonContent.image || "";
          if (existingJsonContent?.banner?.image) {
            jsonContent.banner = jsonContent.banner || {};
            jsonContent.banner.image = existingJsonContent.banner.image;
          }
        }

        if (typeof jsonContent.bg_image === 'string' && jsonContent.bg_image.startsWith('http')) {
            jsonContent.bg_image = basename(jsonContent.bg_image);
        }
        if (typeof jsonContent.image === 'string' && jsonContent.image.startsWith('http')) {
            jsonContent.image = basename(jsonContent.image);
        }
        if (jsonContent.banner?.image && typeof jsonContent.banner.image === 'string' && jsonContent.banner.image.startsWith('http')) {
            jsonContent.banner.image = basename(jsonContent.banner.image);
        }

        const iconIndices = this.extractIndices(updateCmsContentDto?.icon_indices);

        // if (Array.isArray(jsonContent.services)) {
        //   jsonContent.services.forEach((service, index) => {
        //     const fileSlot = iconIndices.indexOf(index);
        //     if (fileSlot !== -1 && icons && icons[fileSlot]) {
        //       service.image = basename(icons[fileSlot].filename);
        //     } else if (existingJsonContent?.services?.[index]?.image) {
        //       service.image = basename(existingJsonContent.services[index].image);
        //     } else if (service.image) {
        //       service.image = basename(service.image);
        //     }
        //   });
        // }

        // if (Array.isArray(jsonContent.blocks)) {
        //   jsonContent.blocks.forEach((block, index) => {
        //     const fileSlot = iconIndices.indexOf(index);
        //     if (fileSlot !== -1 && icons && icons[fileSlot]) {
        //       block.image = basename(icons[fileSlot].filename);
        //     } else if (existingJsonContent?.blocks?.[index]?.image) {
        //       block.image = basename(existingJsonContent.blocks[index].image);
        //     } else if (block.image) {
        //       block.image = basename(block.image);
        //     }
        //   });
        // }

        if (Array.isArray(jsonContent.services)) {
  jsonContent.services.forEach((service, index) => {
    const fileSlot = iconIndices.indexOf(index);
    if (fileSlot !== -1 && icons && icons[fileSlot]) {
      service.image = basename(icons[fileSlot].filename);
    } else if (service.image) {
      service.image = basename(service.image);
    } else if (existingJsonContent?.services?.[index]?.image) {
      service.image = basename(existingJsonContent.services[index].image);
    } else {
      service.image = "";
    }
  });
}

if (Array.isArray(jsonContent.blocks)) {
  jsonContent.blocks.forEach((block, index) => {
    const fileSlot = iconIndices.indexOf(index);
    if (fileSlot !== -1 && icons && icons[fileSlot]) {
      block.image = basename(icons[fileSlot].filename);
    } else if (block.image) {
      block.image = basename(block.image);
    } else if (existingJsonContent?.blocks?.[index]?.image) {
      block.image = basename(existingJsonContent.blocks[index].image);
    } else {
      block.image = "";
    }
  });
}

        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }

      case PageType.ABOUT_US: {
        return this.cmsContentRepository.update(id, {
    json_content: {
      banner_heading: updateCmsContentDto?.json_content?.banner_heading || exitingContent.json_content?.banner_heading || "About Us",
        banner_heading_tag: updateCmsContentDto?.json_content?.banner_heading_tag || exitingContent.json_content?.banner_heading_tag || "h1",
        banner_description: updateCmsContentDto?.json_content?.banner_description || exitingContent.json_content?.banner_description || "",
        banner_description_font_size: updateCmsContentDto?.json_content?.banner_description_font_size || exitingContent.json_content?.banner_description_font_size || "16",
        banner_image: updateCmsContentDto?.json_content?.banner_image || exitingContent.json_content?.banner_image || "",

      top_title: updateCmsContentDto?.json_content?.top_title || "",
      top_title_tag: updateCmsContentDto?.json_content?.top_title_tag || exitingContent.json_content?.top_title_tag || "h2",
      top_description: updateCmsContentDto?.json_content?.top_description || "",
      top_description_font_size: updateCmsContentDto?.json_content?.top_description_font_size || exitingContent.json_content?.top_description_font_size || "",
      mid_sub_title: updateCmsContentDto?.json_content?.mid_sub_title || "",
      mid_sub_title_tag: updateCmsContentDto?.json_content?.mid_sub_title_tag || exitingContent.json_content?.mid_sub_title_tag || "h3",
      mid_sub_span_title: updateCmsContentDto?.json_content?.mid_sub_span_title || exitingContent.json_content?.mid_sub_span_title || "",
mid_sub_span_title_tag: updateCmsContentDto?.json_content?.mid_sub_span_title_tag || exitingContent.json_content?.mid_sub_span_title_tag || "h4",
      mid_sub_description: updateCmsContentDto?.json_content?.mid_sub_description || "",
      mid_sub_description_font_size: updateCmsContentDto?.json_content?.mid_sub_description_font_size || exitingContent.json_content?.mid_sub_description_font_size || "",
      mid_image: imagePath ? basename(imagePath) : exitingContent.json_content.mid_image,
      mid_image_size: jsonContent?.mid_image_size ?? existingJsonContent?.mid_image_size ?? "100",
      background_color: updateCmsContentDto?.json_content?.background_color || exitingContent.json_content.background_color || "",
    },
  });
}

      case PageType.HOME_PAGE_CONTENT_EVERY_SPACE:
      case PageType.HOME_PAGE_CONTENT_MEET_US:
      case PageType.CREATING_THE_HOME_OF_YOUR_DREAMS:
      case PageType.CREATING_THE_HOME_OF_YOUR_DREAMS_2: {
        return this.cmsContentRepository.update(id, {
          json_content: {
            top_title: updateCmsContentDto?.json_content?.top_title || "",
            top_description: updateCmsContentDto?.json_content?.top_description || "",
            mid_sub_title: updateCmsContentDto?.json_content?.mid_sub_title || "",
            mid_sub_description: updateCmsContentDto?.json_content?.mid_sub_description || "",
            mid_image: imagePath ? basename(imagePath) : exitingContent.json_content.mid_image,
            background_color: updateCmsContentDto?.json_content?.background_color || exitingContent.json_content.background_color || "",
          },
        });
      }

      case PageType.TEAM:
      case PageType.FAQS:
      case PageType.HOME_PAGE_CONTENT:
      case PageType.HOME_PAGE_CONTENT_WHAT_WE_ARE:
      case PageType.HOME_PAGE_CONTENT_HOW_WE_WORK:
        return this.cmsContentRepository.update(id, {
          json_content: {
            title: updateCmsContentDto?.title || "",
            description: updateCmsContentDto?.description || "",
            designation: updateCmsContentDto?.designation || "",
            image: imagePath ? basename(imagePath) : exitingContent.json_content.image,
            background_color: updateCmsContentDto?.background_color || exitingContent.json_content.background_color || "",
          },
        });

      case PageType.HOME_PAGE_THE_WAY_WE_WORK: {
        if (imagePath) {
          jsonContent.bg_image = basename(imagePath);
        } else if (jsonContent.bg_image !== undefined && jsonContent.bg_image !== null) {
          jsonContent.bg_image = jsonContent.bg_image ? basename(jsonContent.bg_image) : "";
        } else {
          jsonContent.bg_image = existingJsonContent?.bg_image ? basename(existingJsonContent.bg_image) : "";
        }

        const iconIndices = this.extractIndices(updateCmsContentDto?.icon_indices);

        if (Array.isArray(jsonContent.cards)) {
            jsonContent.cards.forEach((card, index) => {
                const fileSlot = iconIndices.indexOf(index);
                if (fileSlot !== -1 && icons && icons[fileSlot]) {
                    card.icon = basename(icons[fileSlot].filename);
                } else if (existingJsonContent?.cards?.[index]?.icon) {
                    card.icon = basename(existingJsonContent.cards[index].icon);
                } else if (card.icon) {
                    card.icon = basename(card.icon);
                }
            });
        }
        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }

      case PageType.WHAT_WE_OFFER: {
        if (!jsonContent.cards && existingJsonContent?.cards) jsonContent.cards = existingJsonContent.cards;

        if (imagePath) {
          jsonContent.image = basename(imagePath);
          jsonContent.bg_image = basename(imagePath);
        } else if (jsonContent.bg_image !== undefined && jsonContent.bg_image !== null) {
          jsonContent.bg_image = jsonContent.bg_image ? basename(jsonContent.bg_image) : "";
          jsonContent.image = jsonContent.image ? basename(jsonContent.image) : "";
        } else {
          jsonContent.bg_image = existingJsonContent?.bg_image ? basename(existingJsonContent.bg_image) : "";
          jsonContent.image = existingJsonContent?.image ? basename(existingJsonContent.image) : "";
        }
        
        const iconIndices = this.extractIndices(updateCmsContentDto?.icon_indices);

        if (Array.isArray(jsonContent.cards)) {
          jsonContent.cards.forEach((card, index) => {
            const fileSlot = iconIndices.indexOf(index);
            if (fileSlot !== -1 && icons && icons[fileSlot]) {
                card.icon = basename(icons[fileSlot].filename);
                card.image = basename(icons[fileSlot].filename);
            } else if (existingJsonContent?.cards?.[index]?.icon || existingJsonContent?.cards?.[index]?.image) {
                card.icon = basename(existingJsonContent.cards[index].icon || existingJsonContent.cards[index].image);
                card.image = card.icon;
            }
          });
        }
        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }

      case PageType.REDIRECT_WHAT_WE_OFFER: {
        if (imagePath) {
          jsonContent.bg_image = basename(imagePath);
        } else if (jsonContent.bg_image !== undefined && jsonContent.bg_image !== null) {
          if (typeof jsonContent.bg_image === 'string' && jsonContent.bg_image.startsWith('data:')) {
            jsonContent.bg_image = "";
          } else {
            jsonContent.bg_image = jsonContent.bg_image ? basename(jsonContent.bg_image) : "";
          }
        } else {
          jsonContent.bg_image = existingJsonContent?.bg_image ? basename(existingJsonContent.bg_image) : "";
        }

        if (!jsonContent.sections && existingJsonContent?.sections) {
          jsonContent.sections = existingJsonContent.sections;
        }

        const imageIndices = this.extractIndices(updateCmsContentDto?.image_indices);

        if (Array.isArray(jsonContent.sections)) {
          jsonContent.sections.forEach((section, index) => {
            const fileSlot = imageIndices.indexOf(index);
            if (fileSlot !== -1 && icons && icons[fileSlot]) {
              section.image = basename(icons[fileSlot].filename);
            } else if (existingJsonContent?.sections?.[index]?.image) {
              section.image = basename(existingJsonContent.sections[index].image);
            } else if (section.image) {
              section.image = basename(section.image);
            }
          });
        }
        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }

      case PageType.NAVBAR_SERVING_AREA: {
        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }

      case PageType.SUSTAINABLE_FURNITURE: {
        // Prevent wiping out cards if the frontend accidentally sends a missing payload
        if (!jsonContent.cards && existingJsonContent?.cards) {
          jsonContent.cards = existingJsonContent.cards;
        }

        // Extract the array of indices matching the uploaded files
        const iconIndices = this.extractIndices(updateCmsContentDto?.icon_indices);

        if (Array.isArray(jsonContent.cards)) {
          jsonContent.cards.forEach((card, index) => {
            const fileSlot = iconIndices.indexOf(index);
            
            if (fileSlot !== -1 && icons && icons[fileSlot]) {
                // If a new image was uploaded for this card, save the new filename
                card.image = basename(icons[fileSlot].filename);
            } else if (existingJsonContent?.cards?.[index]?.image) {
                // Otherwise, preserve the existing image filename
                card.image = basename(existingJsonContent.cards[index].image);
            } else if (card.image) {
                card.image = basename(card.image);
            }
          });
        }
        
        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }

      case PageType.REDIRECT_CAREER: {

        if (imagePath) {
    jsonContent.bg_image = basename(imagePath);
  } else if (jsonContent.bg_image !== undefined && jsonContent.bg_image !== null) {
    jsonContent.bg_image = jsonContent.bg_image ? basename(jsonContent.bg_image) : "";
  } else {
    jsonContent.bg_image = existingJsonContent?.bg_image ? basename(existingJsonContent.bg_image) : "";
  }
  // Don't wipe sections if the admin form only submits banner fields
  if (!jsonContent.sections && existingJsonContent?.sections) {
    jsonContent.sections = existingJsonContent.sections;
  }

  // Preserve the CKEditor table HTML if this particular save didn't include it
  if (jsonContent.tableContent === undefined && existingJsonContent?.tableContent !== undefined) {
    jsonContent.tableContent = existingJsonContent.tableContent;
  }

  const imageIndices = this.extractIndices(updateCmsContentDto?.image_indices);

  if (Array.isArray(jsonContent.sections)) {
    jsonContent.sections.forEach((section, index) => {
      const fileSlot = imageIndices.indexOf(index);
      if (fileSlot !== -1 && icons && icons[fileSlot]) {
        section.image = basename(icons[fileSlot].filename);
      } else if (existingJsonContent?.sections?.[index]?.image) {
        section.image = basename(existingJsonContent.sections[index].image);
      } else if (section.image) {
        section.image = basename(section.image);
      }
    });
  }

  return this.cmsContentRepository.update(id, { json_content: jsonContent });
}
   case PageType.NAVBAR_HEADER_MENU: {
     return this.cmsContentRepository.update(id, { json_content: jsonContent });
   }

         case PageType.REDIRECT_THANK_YOU: {
        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }

            case PageType.HOME_PAGE_CONTENT_FURNITURE_FACTORY: {
        const iconIndices = this.extractIndices(updateCmsContentDto?.icon_indices);

        // image1 = slot 0, image2 = slot 1
        const file0Slot = iconIndices.indexOf(0);
  if (file0Slot !== -1 && icons && icons[file0Slot]) {
    jsonContent.topImage = basename(icons[file0Slot].filename);
  } else if (jsonContent.topImage !== undefined && jsonContent.topImage !== null) {
    jsonContent.topImage = jsonContent.topImage ? basename(jsonContent.topImage) : "";
  } else {
    jsonContent.topImage = existingJsonContent?.topImage ? basename(existingJsonContent.topImage) : "";
  }

  const file1Slot = iconIndices.indexOf(1);
  if (file1Slot !== -1 && icons && icons[file1Slot]) {
    jsonContent.image1 = basename(icons[file1Slot].filename);
  } else if (jsonContent.image1 !== undefined && jsonContent.image1 !== null) {
    jsonContent.image1 = jsonContent.image1 ? basename(jsonContent.image1) : "";
  } else {
    jsonContent.image1 = existingJsonContent?.image1 ? basename(existingJsonContent.image1) : "";
  }

  const file2Slot = iconIndices.indexOf(2);
  if (file2Slot !== -1 && icons && icons[file2Slot]) {
    jsonContent.image2 = basename(icons[file2Slot].filename);
  } else if (jsonContent.image2 !== undefined && jsonContent.image2 !== null) {
    jsonContent.image2 = jsonContent.image2 ? basename(jsonContent.image2) : "";
  } else {
    jsonContent.image2 = existingJsonContent?.image2 ? basename(existingJsonContent.image2) : "";
  }

        // 🆕 Video is now a real upload. The controller already puts the
        // uploaded filename onto updateCmsContentDto.video for any page type,
        // so prefer that; otherwise fall back to whatever the JSON body says
        // (lets the frontend explicitly clear it by sending "").
        if (updateCmsContentDto?.video) {
          jsonContent.video = basename(updateCmsContentDto.video);
        } else if (jsonContent.video !== undefined && jsonContent.video !== null) {
          jsonContent.video = jsonContent.video ? basename(jsonContent.video) : "";
        } else {
          jsonContent.video = existingJsonContent?.video ? basename(existingJsonContent.video) : "";
        }

        jsonContent.heading = jsonContent.heading || existingJsonContent?.heading || "Large Modular Furniture Factories";
        jsonContent.headingColor = jsonContent.headingColor || existingJsonContent?.headingColor || "#000000";
        jsonContent.description = jsonContent.description ?? existingJsonContent?.description ?? "";
        // 🆕 descriptionFontSize, clamped to the 10–30px range regardless of what's sent
        const rawFontSize = Number(jsonContent.descriptionFontSize ?? existingJsonContent?.descriptionFontSize ?? 16);
        jsonContent.descriptionFontSize = Number.isFinite(rawFontSize)
          ? Math.min(30, Math.max(10, rawFontSize))
          : 16;
        jsonContent.buttonText = jsonContent.buttonText || existingJsonContent?.buttonText || "View More";
        jsonContent.buttonLink = jsonContent.buttonLink || existingJsonContent?.buttonLink || "/furniture/";
        jsonContent.topImageCaption = jsonContent.topImageCaption ?? existingJsonContent?.topImageCaption ?? "";
        jsonContent.image1Caption = jsonContent.image1Caption ?? existingJsonContent?.image1Caption ?? "";
        jsonContent.image2Caption = jsonContent.image2Caption ?? existingJsonContent?.image2Caption ?? "";

        return this.cmsContentRepository.update(id, { json_content: jsonContent });
      }
      
      default:
        return this.update(id, updateCmsContentDto);
    }
  }

  async updateJsonContentChildImage(id: number, updateCmsContentDto: UpdateJsonContentChildImageDto, imagePath: string) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException(`Invalid content id: ${id}`);
    }
    const existingContent = await this.cmsContentRepository.findOne({ where: { id } });
    if (!existingContent) return null;

    const jsonContent = existingContent.json_content;

    // --- ISOLATED FIX START ---
    let targetArray = jsonContent;
    let isWrapped = false;
    
    if (jsonContent && !Array.isArray(jsonContent) && Array.isArray(jsonContent.cards)) {
        targetArray = jsonContent.cards;
        isWrapped = true;
    }

    if (!targetArray || !Array.isArray(targetArray)) return null;
    // --- ISOLATED FIX END ---
    // if (!jsonContent || !Array.isArray(jsonContent)) return null;

    const itemIndex = updateCmsContentDto?.item_index;
    if (itemIndex === undefined || itemIndex < 0 || itemIndex >= targetArray.length) return null;

    targetArray[itemIndex].title = updateCmsContentDto?.title || '';
    targetArray[itemIndex].description = updateCmsContentDto?.description || '';
    
    if (targetArray[itemIndex].designation) {
      targetArray[itemIndex].designation = updateCmsContentDto?.designation || '';
    }

    if (imagePath) {
      targetArray[itemIndex].image = basename(imagePath);
    }

    if (isWrapped) {
        jsonContent.cards = targetArray;
        return this.cmsContentRepository.update(id, { json_content: jsonContent });
    }
    return this.cmsContentRepository.update(id, { json_content: targetArray });
    // try {
    //   const result = await this.cmsContentRepository.update(id, { json_content: jsonContent });
    //   if (result.affected === 0) return null;
    //   return result;
    // } catch (error) {
    //   throw error;
    // }
  }

  async updateJsonContentHomepageBanner(id: number, updateCmsContentDto: any, topIconPath: string, bannerImagePath: string, mobileBannerImagePath: string) {
    let existingContent = await this.cmsContentRepository.findOne({ 
      where: { page_type: PageType.HOMEPAGE_BANNER } 
    });

    if (!existingContent) {
      existingContent = this.cmsContentRepository.create({
        page_type: PageType.HOMEPAGE_BANNER,
        json_content: []
      });
      existingContent = await this.cmsContentRepository.save(existingContent);
    }

    let jsonContent = this.parseJsonData(existingContent.json_content, []);
    if (!Array.isArray(jsonContent)) jsonContent = [];

    const action = updateCmsContentDto?.action || 'update';
    const itemIndex = parseInt(updateCmsContentDto?.item_index, 10);

    if (action === 'reorder') {
      const fromIndex = parseInt(updateCmsContentDto?.from_index, 10);
      const toIndex = parseInt(updateCmsContentDto?.to_index, 10);
      if (fromIndex >= 0 && fromIndex < jsonContent.length && toIndex >= 0 && toIndex < jsonContent.length) {
        const [movedItem] = jsonContent.splice(fromIndex, 1);
        jsonContent.splice(toIndex, 0, movedItem);
      }
    } 
    else if (action === 'delete') {
      if (itemIndex >= 0 && itemIndex < jsonContent.length) {
        jsonContent.splice(itemIndex, 1);
      }
    } 
    else if (action === 'toggle_active') {
      if (itemIndex >= 0 && itemIndex < jsonContent.length) {
        jsonContent[itemIndex].is_active = updateCmsContentDto.is_active === 'true';
      }
    } 
    else if (action === 'add' || action === 'update') {
      const slideData: any = {};
      slideData.title = updateCmsContentDto?.title || '';
      slideData.sub_title = updateCmsContentDto?.sub_title || '';
      slideData.top_slogan = updateCmsContentDto?.top_slogan || '';
      slideData.description = updateCmsContentDto?.description || '';
      slideData.button_text = updateCmsContentDto?.button_text || '';
      slideData.button_link = updateCmsContentDto?.button_link || '';
      slideData.text_color = updateCmsContentDto?.text_color || '#ffffff';
      slideData.is_active = updateCmsContentDto?.is_active !== 'false';

      if (action === 'add') {
        if (topIconPath) slideData.top_icon = basename(topIconPath);
        if (bannerImagePath) slideData.banner_image = basename(bannerImagePath);
        if (mobileBannerImagePath) slideData.mobile_banner_image = basename(mobileBannerImagePath);
        jsonContent.push(slideData);
      } 
      else if (action === 'update') {
        if (itemIndex >= 0 && itemIndex < jsonContent.length) {
          jsonContent[itemIndex] = { ...jsonContent[itemIndex], ...slideData };
          if (topIconPath) jsonContent[itemIndex].top_icon = basename(topIconPath);
          if (bannerImagePath) jsonContent[itemIndex].banner_image = basename(bannerImagePath);
          if (mobileBannerImagePath) jsonContent[itemIndex].mobile_banner_image = basename(mobileBannerImagePath);
        } else {
          throw new BadRequestException(`Invalid item_index: ${itemIndex}`);
        }
      }
    }

    try {
      const result = await this.cmsContentRepository
        .createQueryBuilder()
        .update(CmsContent)
        .set({ json_content: jsonContent })
        .where("id = :id", { id: existingContent.id })
        .execute();

      if (result.affected === 0) {
        throw new BadRequestException('Update failed, no rows affected');
      }
      return { success: true, message: "Banner updated successfully" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new BadRequestException('Error updating content: ' + errorMessage);
    }
  }

  async updateTeamPageMedia(id: number, dto: any, imagePath: string, videoPath: string) {
  const existingContent = await this.cmsContentRepository.findOne({ where: { id } });
  if (!existingContent) throw new NotFoundException(`Content with id ${id} not found`);

  let jsonContent = this.parseJsonData(existingContent.json_content, { items: [] });
  if (!Array.isArray(jsonContent.items)) jsonContent.items = [];

  const action = dto?.action || 'add';
  const itemIndex = parseInt(dto?.item_index, 10);

  if (action === 'add') {
    if (imagePath) jsonContent.items.push({ type: 'image', url: basename(imagePath) });
  if (videoPath) jsonContent.items.push({ type: 'video', url: basename(videoPath) });
  } else if (action === 'delete') {
    if (itemIndex >= 0 && itemIndex < jsonContent.items.length) {
      jsonContent.items.splice(itemIndex, 1);
    }
  } else if (action === 'update') {
    if (itemIndex >= 0 && itemIndex < jsonContent.items.length) {
      if (imagePath) jsonContent.items[itemIndex].image = basename(imagePath);
      if (videoPath) jsonContent.items[itemIndex].video = basename(videoPath);
    }
  }

  return this.cmsContentRepository.update(id, { json_content: jsonContent });
}

  async updateEstimateCards(id: number, dto: any, imagePath: string) {
    const existingContent = await this.cmsContentRepository.findOne({ where: { id } });
    if (!existingContent) throw new BadRequestException(`Content not found`);

    let jsonContent = this.parseJsonData(existingContent.json_content, []);
    if (!Array.isArray(jsonContent)) jsonContent = [];

    const action = dto?.action || 'update';
    const itemIndex = parseInt(dto?.item_index, 10);

    if (action === 'add') {
      jsonContent.push({
        title: dto?.title || '',
        link: dto?.link || '/estimator-for-home',
        description: dto?.description || '', 
        icon_bg_color: dto?.icon_bg_color || '#ffffff', 
        font_color: dto?.font_color || '#000000', 
        image: imagePath ? basename(imagePath) : null,
        icon: dto?.icon ? (dto.icon.includes('.') ? basename(dto.icon) : dto.icon) : null,
        is_active: dto?.is_active !== 'false'
      });
    } else if (action === 'delete') {
      if (itemIndex >= 0 && itemIndex < jsonContent.length) {
        jsonContent.splice(itemIndex, 1);
      }
    } else if (action === 'reorder') {
      const fromIndex = parseInt(dto?.from_index, 10);
      const toIndex = parseInt(dto?.to_index, 10);
      if (fromIndex >= 0 && fromIndex < jsonContent.length && toIndex >= 0 && toIndex < jsonContent.length) {
        const [movedItem] = jsonContent.splice(fromIndex, 1);
        jsonContent.splice(toIndex, 0, movedItem);
      }
    } else if (action === 'toggle_active') {
      if (itemIndex >= 0 && itemIndex < jsonContent.length) {
        jsonContent[itemIndex].is_active = dto?.is_active === 'true';
      }
    } else {
      if (itemIndex >= 0 && itemIndex < jsonContent.length) {
        jsonContent[itemIndex].title = dto?.title || '';
        jsonContent[itemIndex].link = dto?.link || '/estimator-for-home';
        jsonContent[itemIndex].description = dto?.description || ''; 
        jsonContent[itemIndex].icon_bg_color = dto?.icon_bg_color || '#ffffff'; 
        jsonContent[itemIndex].font_color = dto?.font_color || '#000000'; 
        jsonContent[itemIndex].is_active = dto?.is_active !== 'false';

        if (dto?.icon !== undefined) {
        jsonContent[itemIndex].icon = dto.icon ? (dto.icon.includes('.') ? basename(dto.icon) : dto.icon) : null;
      }

        if (imagePath) {
          jsonContent[itemIndex].image = basename(imagePath);
        } else if (dto?.image) {
          jsonContent[itemIndex].image = basename(dto.image);
        }
      }
    }

    return this.cmsContentRepository.update(id, { json_content: jsonContent });
  }

  async updateWhatWeOfferCards(id: number, dto: any, imagePath: string) {
    const existingContent = await this.cmsContentRepository.findOne({ where: { id } });
    if (!existingContent) throw new BadRequestException(`Content not found`);

    let jsonContent = this.parseJsonData(existingContent.json_content, []);
    if (!Array.isArray(jsonContent)) jsonContent = [];

    const action = dto?.action || 'update';
    const itemIndex = parseInt(dto?.item_index, 10);

    if (action === 'add') {
      jsonContent.push({
        title: dto?.title || '',
        description: dto?.description || '',
        designation: dto?.designation || '',
        image: imagePath ? basename(imagePath) : null,
        is_active: dto?.is_active !== 'false'
      });
    } else if (action === 'delete') {
      if (itemIndex >= 0 && itemIndex < jsonContent.length) {
        jsonContent.splice(itemIndex, 1);
      }
    } else if (action === 'reorder') {
      const fromIndex = parseInt(dto?.from_index, 10);
      const toIndex = parseInt(dto?.to_index, 10);
      if (fromIndex >= 0 && fromIndex < jsonContent.length && toIndex >= 0 && toIndex < jsonContent.length) {
        const [movedItem] = jsonContent.splice(fromIndex, 1);
        jsonContent.splice(toIndex, 0, movedItem);
      }
    } else if (action === 'toggle_active') {
      if (itemIndex >= 0 && itemIndex < jsonContent.length) {
        jsonContent[itemIndex].is_active = dto?.is_active === 'true';
      }
    } else {
      if (jsonContent[itemIndex]) {
        jsonContent[itemIndex].title = dto?.title || '';
        jsonContent[itemIndex].description = dto?.description || '';
        jsonContent[itemIndex].designation = dto?.designation || '';
        jsonContent[itemIndex].is_active = dto?.is_active !== 'false';
        if (imagePath) jsonContent[itemIndex].image = basename(imagePath);
      }
    }

    return this.cmsContentRepository.update(id, { json_content: jsonContent });
  }
}