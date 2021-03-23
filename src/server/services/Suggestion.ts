import { Repository } from "typeorm";
import { ProfileModel } from "../db/models/Profile";
import { SuggestionModel } from "../db/models/Suggestion";
import { TranslationModel } from "../db/models/Translation";

export class SuggestionService {

    private repository;

    constructor (databaseRepository: Repository<SuggestionModel>) {
        this.repository = databaseRepository
    }

    async getAll() {
        return await this.repository.find();
    }

    async getById(sourceId: number) {
        return await this.repository.findOne({"id": sourceId});
    }

    async addNewSuggestion(value: string, targetTranslation: TranslationModel, author: ProfileModel) {
        let suggestion = await this.repository.findOne({
            translation: targetTranslation,
            author: author
        });

        if ( ! suggestion) {
            suggestion = this.repository.create({
                translation: targetTranslation,
                author: author,
                suggestion: value
            });
            await this.repository.save(suggestion);
        } else {
            suggestion.suggestion = value;
            await this.repository.save(suggestion);
        }

        return suggestion;
    }
}
