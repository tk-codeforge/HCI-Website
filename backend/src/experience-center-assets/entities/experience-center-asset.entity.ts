import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

// Brand new table, isolated from cms_parent_child. It has no relation to
// that table, does not reuse its PageType enum, and is never touched by
// the shared media-library / clone-to-Noida logic that lives on it.
@Entity('experience_center_assets')
@Index(['page_type', 'parent_slug'])
export class ExperienceCenterAsset {
  @PrimaryGeneratedColumn()
  id: number;

  // e.g. "experience-center-royal-living-room-design-with-yellow-sofas"
  @Column()
  parent_slug: string;

  // "experience_center" (gallery image) | "experience_center_video" (banner video)
  @Column()
  page_type: string;

  // Used for gallery-image cards; left null for the video row
  @Column({ nullable: true })
  title: string;

  // filename only – the service builds the full URL on the way out
  @Column()
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
parent_asset_id: number | null;
}
