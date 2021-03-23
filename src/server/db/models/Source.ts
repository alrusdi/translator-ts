import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TranslationModel } from "./Translation";

@Entity({name:"sources", synchronize: true})
export class SourceModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    source!: string;

    @Column("datetime")
    createdAt: Date = new Date();

    @OneToMany(() => TranslationModel, translation => translation.source)
    translations!: TranslationModel[];

    toJSON() {
        return {
            "id": this.id,
            "value": this.source || "",
            "translations": (this.translations || []).map((t) => t.toJSON())
        }
    }
}
