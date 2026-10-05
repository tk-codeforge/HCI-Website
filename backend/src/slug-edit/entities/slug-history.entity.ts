import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('slug_history')
@Index('IDX_slug_history_lookup', ['entityType', 'oldSlug'])
export class SlugHistory {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 50 }) entityType: string;
  @Column() entityId: number;
  @Column({ length: 191 }) oldSlug: string;
  @CreateDateColumn() createdAt: Date;
}