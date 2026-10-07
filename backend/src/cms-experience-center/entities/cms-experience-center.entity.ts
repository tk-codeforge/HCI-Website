import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms_experience_center')
export class CmsExperienceCenter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    // @Column()
    // description: string;

    // @Column()
    // image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true, type: 'text' })
description: string;
    
@Column({ type: 'varchar', length: 255, nullable: true })
image: string | null;

@Column({ type: 'boolean', default: true })
is_active: boolean;
    
}