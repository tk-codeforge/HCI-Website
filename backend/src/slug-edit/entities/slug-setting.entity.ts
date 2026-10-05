import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('slug_settings')
@Unique('UQ_slug_type_entity', ['entityType', 'entityId']) // one slug per item
@Unique('UQ_slug_type_slug', ['entityType', 'slug'])       // no duplicate slugs
export class SlugSetting {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 50 }) entityType: string;
  @Column() entityId: number;
  @Column({ length: 191 }) slug: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}