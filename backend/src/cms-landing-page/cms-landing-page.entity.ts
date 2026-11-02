import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// One row per CMS-managed landing page. `page_key` is the page slug (e.g. "design-your-dream-space"),
// `content` holds the whole editable page (headings, text, images, phone / WhatsApp numbers) as JSON.
@Entity('cms_landing_page')
export class CmsLandingPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120, unique: true })
  page_key: string;

  @Column({ type: 'json', nullable: true })
  content: Record<string, any> | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
