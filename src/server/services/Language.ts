
import { Repository } from "typeorm";
import { LanguageModel } from "../db/models/Language";

export class LanguageService {

    private repository;

    constructor (databaseRepository: Repository<LanguageModel>) {
        this.repository = databaseRepository
    }

    async getAll() {
        return await this.repository.find();
    }

    async getByCode(languageCode: string) {
        return await this.repository.findOne({"code": languageCode});
    }
}