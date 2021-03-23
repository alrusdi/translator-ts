import { Repository } from "typeorm";
import { ProfileModel } from "../db/models/Profile";

export class ProfileService {
    private repository;

    constructor (databaseRepository: Repository<ProfileModel>) {
        this.repository = databaseRepository
    }

    async createProfile(oauthId: string, nickname: string | undefined) {
        const user= this.repository.create({
            oauthId: oauthId,
            nickname: nickname,
            isActive: true,
            isReady: nickname ? true : false
        })
        await this.repository.save(user)
        return user
    }

    async getProfileByOauthId(oauthId: string) {
        return await this.repository.findOne({where: {oauthId}})
    }

    async getProfileById(id: number) {
        return await this.repository.findOne({where: {id}})
    }

    async processOauth(oauthId: string, nickname: string | undefined) {
        let user = await this.getProfileByOauthId(oauthId);
        if ( ! user ) {
            user = await this.createProfile(oauthId, nickname);
        }
        if (user !== undefined) {
            return user.id;
        }
        return undefined;
    }
}