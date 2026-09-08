import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms_basic_pages')
export class CmsBasicPage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, default: '' })
    title: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    writer_name: string;

    @Column({ type: 'boolean', default: false })
    show_author_date: boolean;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'json', nullable: true })
    faqs: any; 

    @Column({ type: 'json', nullable: true })
    accordions: any; 

    @Column({ type: 'varchar', length: 50, default: 'Draft' })
    status: string;

    @Column({ type: 'json', nullable: true })
    seo_content: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}