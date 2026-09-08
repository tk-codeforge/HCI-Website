import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms_gallery_design')
export class CmsGalleryDesign {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    room_dimension: string;

    @Column()
    image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true })
    banner_heading: string;

    @Column({ nullable: true })
    banner_description: string;

    @Column({ nullable: true })
    banner_image: string;

    @Column({ nullable: true })
banner_heading_tag: string;

@Column({ nullable: true, type: 'int' })
banner_description_font_size: number;

@Column({ default: false })
is_manage_banner: boolean;

@Column({ default: 'design_gallery' })
banner_key: string;
}