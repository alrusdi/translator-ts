import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ProfileModel } from "./Profile";
import { TranslationModel } from "./Translation";

@Entity({name:"suggestions", synchronize: true})
export class SuggestionModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => ProfileModel, profile => profile.translations)
    author!: ProfileModel;

    @ManyToOne(() => TranslationModel, translation => translation.suggestions)
    translation!: TranslationModel;

    @Column()
    suggestion!: string;

    @Column("datetime")
    createdAt: Date = new Date();
}
