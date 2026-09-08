export class CreateCmsPageDto {
    title: string;
    writer_name?: string;
    // --- NEW: Allow saving the toggle state ---
    show_author_date?: boolean;
    content?: string;
    status: string;
    faqs?: any[];
    accordions?: any[];
    content_blocks?: any[]; // Added

    banner_title?: string;
    banner_subtitle?: string;
    banner_image?: string;
}