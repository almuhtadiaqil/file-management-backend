import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { v4 as uuidv4 } from "uuid"

@Entity()
export class Directory {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4()

    @Column({type: 'varchar',nullable:true})
    parent_name: string | null = null;

    @Column()
    name!: string;

    @Column()
    path!: string;

    @Column()
    is_directory: boolean = false;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
