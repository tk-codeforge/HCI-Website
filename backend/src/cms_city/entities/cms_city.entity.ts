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
    // ------------------------------

    @Column('json', { nullable: true })
    seo_content: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}