import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TranslationModel } from "./Translation";

@Entity({name:"languages", synchronize: true})
export class LanguageModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    code!: string;

    @Column({unique: true})
    title!: string;

    @OneToMany(() => TranslationModel, translation => translation.source)
    translations!: TranslationModel[];
}
