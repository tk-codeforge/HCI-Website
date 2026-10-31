import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity("cms_city")
export class CmsCity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, })
    city_type: string;

    @Column()
    main_title: string;

    @Column('text')
    main_description: string;

    @Column({ nullable: true }) 
    location_image: string;

    @Column()
    side_title: string;

    @Column('text')
    side_description: string;

    @Column({ nullable: true }) 
    side_image: string;

    // --- NEW HERO BANNER FIELDS ---
    @Column({ nullable: true })
    banner_title: string;

    @Column({ nullable: true })
    banner_subtitle: string;

    @Column({ nullable: true })
    banner_image: string;

    // Mobile hero banner
@Column({ type: 'varchar', length: 255, nullable: true })
mobile_banner_image: string | null;

// Large project photos
@Column({ type: 'varchar', length: 255, nullable: true })
project_image_1: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_2: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_3: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_4: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_5: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_6: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
banner_image_alt: string;

@Column({ type: 'varchar', length: 255, nullable: true })
location_image_alt: string;

@Column({ type: 'varchar', length: 255, nullable: true })
side_image_alt: string;

// Project image alt text
@Column({ type: 'varchar', length: 255, nullable: true })
project_image_1_alt: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_2_alt: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_3_alt: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_4_alt: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_5_alt: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
project_image_6_alt: string | null;
    // ------------------------------

    @Column({ type: 'varchar', length: 2, nullable: true })
main_title_tag: string;

@Column({ type: 'varchar', length: 2, nullable: true })
banner_title_tag: string;

@Column({ type: 'varchar', length: 2, nullable: true })
side_title_tag: string;

    @Column('json', { nullable: true })
    seo_content: any;

    // City-specific sidebar and section settings
@Column({ type: 'json', nullable: true })
city_settings: Record<string, unknown> | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}