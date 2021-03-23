import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TranslationModel } from "./Translation";

type RoleType = "admin" | "manager" | "contributor";

@Entity({name:"profiles", synchronize: true})
export class ProfileModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    nickname!: string;

    @Column({unique: true})
    oauthId: string = "";

    @Column()
    isActive: boolean = false;

    @Column()
    isReady: boolean = false;

    @Column()
    role: RoleType = "contributor";

    @Column("datetime")
    createdAt: Date = new Date();

    @OneToMany(() => TranslationModel, translation => translation.author)
    translations!: TranslationModel[];
}
