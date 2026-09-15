import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWarrantyCmsContent20260915170000 implements MigrationInterface {
  name = 'AddWarrantyCmsContent20260915170000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE cms_content
      MODIFY COLUMN page_type ENUM(
        'refer_and_earn',
        'privacy_policy',
        'term_and_condition',
        'warranty',
        'about_us',
        'about_us_slider',
        'homepage_banner',
        'service',
        'team',
        'award_gallery',
        'blog',
        'experience_center',
        'how_it_works',
        'faq',
        'faqs',
        'home_page_content',
        'home_page_content_how_we_work',
        'home_page_content_what_we_are',
        'home_page_content_meet_us',
        'home_page_content_every_space',
        'home_page_content_why_choose_us',
        'cancellation_policy',
        'creating_the_home_of_your_dreams',
        'creating_the_home_of_your_dreams_2',
        'creating_the_home_of_your_dreams_3',
        'creating_the_home_of_your_dreams_4',
        'creating_the_home_of_your_dreams_5',
        'creating_the_home_of_your_dreams_6',
        'home_page_estimate_banner',
        'home_page_estimate_cards',
        'home_page_content_the_way_we_work',
        'what_we_offer',
        'footer_content',
        'navbar_serving_area',
        'services_page',
        'redirect_what_we_offer',
        'home_page_heading_management',
        'excellence_stats',
        'manage_heading_description',
        'footer_profiles',
        'footer_page_rules',
        'contact_page',
        'team_page_media',
        'sustainable_furniture',
        'redirect_career'
      ) NOT NULL
    `);

    await queryRunner.query(`
      INSERT INTO cms_content (page_type, json_content, created_at, updated_at)
      SELECT
        'warranty',
        JSON_OBJECT(
          'html', cbp.content,
          'hero', JSON_OBJECT(
            'enabled', true,
            'eyebrow', 'OUR WARRANTY COMMITMENT',
            'heading', 'Quality backed by clear warranty terms.',
            'description', 'Understand your applicable warranty coverage, conditions and claim process.'
          ),
          'summary', JSON_OBJECT(
            'enabled', true,
            'heading', 'Warranty at a glance',
            'subheading', 'Coverage varies by product, material, workmanship and applicable documentation.'
          ),
          'categories', JSON_ARRAY(
            JSON_OBJECT('enabled', true, 'title', 'Modular / Wooden Work', 'duration', '10 Years'),
            JSON_OBJECT('enabled', true, 'title', 'Loose Furniture', 'duration', '5 Years'),
            JSON_OBJECT('enabled', true, 'title', 'Hardware', 'duration', '3 + 7 Years'),
            JSON_OBJECT('enabled', true, 'title', 'Laminate / Acrylic / Membrane', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'PU / Duco / Polish Finish', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'POP / Gypsum False Ceiling', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Paint / Painting Work', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Electrical Wires / Cables', 'duration', '20 Years'),
            JSON_OBJECT('enabled', true, 'title', 'Switches & Sockets', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Ceiling Lights', 'duration', '2 Years'),
            JSON_OBJECT('enabled', true, 'title', 'Spot / COB / Profile / Decorative Lights', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Plumbing Work', 'duration', '7 Years'),
            JSON_OBJECT('enabled', true, 'title', 'Civil Work', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Wallpaper', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Glass Work', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Louvers', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Charcoal / Fluted Panels', 'duration', '1 Year'),
            JSON_OBJECT('enabled', true, 'title', 'Wall Design / Decorative Wall Finish', 'duration', '1 Year')
          ),
          'process', JSON_OBJECT(
            'enabled', true,
            'eyebrow', 'WARRANTY CLAIMS',
            'heading', 'A clear process when you need support',
            'description', 'Please follow the applicable warranty terms and project documentation when raising a claim.',
            'steps', JSON_ARRAY(
              JSON_OBJECT('number', '01', 'title', 'Report the issue', 'description', 'Notify High Creation Interior within the applicable claim period.'),
              JSON_OBJECT('number', '02', 'title', 'Share details', 'description', 'Provide the relevant invoice, work order, customer ID and supporting information.'),
              JSON_OBJECT('number', '03', 'title', 'Inspection', 'description', 'Our team may inspect the product or completed work to assess warranty applicability.'),
              JSON_OBJECT('number', '04', 'title', 'Resolution', 'description', 'Covered issues may be repaired, replaced or rectified according to the applicable terms.')
            )
          ),
          'supportForm', JSON_OBJECT(
            'enabled', true,
            'eyebrow', 'WARRANTY SUPPORT',
            'heading', 'Need help with a warranty concern?',
            'description', 'Share your details and our team can guide you to the appropriate next step.',
            'submitLabel', 'SUBMIT REQUEST'
          ),
          'cta', JSON_OBJECT(
            'enabled', true,
            'heading', 'Need help with your project?',
            'description', 'Connect with the High Creation Interior team for support and assistance.',
            'buttonText', 'Contact HCI',
            'buttonUrl', '/contact'
          )
        ),
        NOW(),
        NOW()
      FROM cms_basic_pages cbp
      WHERE JSON_UNQUOTE(JSON_EXTRACT(cbp.seo_content, '$.slug')) = 'warranty'
        AND NOT EXISTS (
          SELECT 1 FROM cms_content cc WHERE cc.page_type = 'warranty'
        )
      LIMIT 1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM cms_content WHERE page_type = 'warranty'`);

    await queryRunner.query(`
      ALTER TABLE cms_content
      MODIFY COLUMN page_type ENUM(
        'refer_and_earn',
        'privacy_policy',
        'term_and_condition',
        'about_us',
        'about_us_slider',
        'homepage_banner',
        'service',
        'team',
        'award_gallery',
        'blog',
        'experience_center',
        'how_it_works',
        'faq',
        'faqs',
        'home_page_content',
        'home_page_content_how_we_work',
        'home_page_content_what_we_are',
        'home_page_content_meet_us',
        'home_page_content_every_space',
        'home_page_content_why_choose_us',
        'cancellation_policy',
        'creating_the_home_of_your_dreams',
        'creating_the_home_of_your_dreams_2',
        'creating_the_home_of_your_dreams_3',
        'creating_the_home_of_your_dreams_4',
        'creating_the_home_of_your_dreams_5',
        'creating_the_home_of_your_dreams_6',
        'home_page_estimate_banner',
        'home_page_estimate_cards',
        'home_page_content_the_way_we_work',
        'what_we_offer',
        'footer_content',
        'navbar_serving_area',
        'services_page',
        'redirect_what_we_offer',
        'home_page_heading_management',
        'excellence_stats',
        'manage_heading_description',
        'footer_profiles',
        'footer_page_rules',
        'contact_page',
        'team_page_media',
        'sustainable_furniture',
        'redirect_career'
      ) NOT NULL
    `);
  }
}
