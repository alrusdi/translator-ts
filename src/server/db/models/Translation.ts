import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { LanguageModel } from "./Language";
import { ProfileModel } from "./Profile";
import { SourceModel } from "./Source";
import { SuggestionModel } from "./Suggestion";

@Entity({name:"translations", synchronize: true})
export class TranslationModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => SourceModel, source => source.translations)
    source!: SourceModel;

    @ManyToOne(() => ProfileModel, profile => profile.translations)
    author!: number;

    @ManyToOne(() => LanguageModel, language => language.translations)
    language!: LanguageModel;

    @OneToMany(() => SuggestionModel, suggestion => suggestion.translation)
    suggestions!: SuggestionModel[];

    @Column({ nullable: true })
    translation!: string;

    @Column("datetime")
    createdAt: Date = new Date();

    toJSON() {
        const lang = this.language;
        return {
            "id": this.id,
            "value": this.translation || "",
            "language": {
                "code": lang.code,
                "title": lang.title
            }
        }
    }
}
