import { Repository } from "typeorm";
import { Database } from "../db/Database";
import { ProfileModel } from "../db/models/Profile";
import { SourceModel } from "../db/models/Source";
import { TranslationModel } from "../db/models/Translation";

interface TranslationSuggestion {
    sourceId: number,
    languageCode: string,
    value: string
}

export class TranslationService {
    private translationRepository;
    private sourceRepository;

    constructor (translationRepository: Repository<TranslationModel>, sourceRepository: Repository<SourceModel>) {
        this.translationRepository = translationRepository
        this.sourceRepository = sourceRepository
    }

    async getTranslationsInfo() {
        const sources = await this.sourceRepository.find({ relations: ["translations", "translations.language"] });
        const translations = await this.translationRepository.find();
        const languages = await Database.languages().getAll();
        if (translations.length > 0) {
            console.log("Hallo!")
        }
        return {
            "languages": languages,
            "sources": sources.map((s)=>s.toJSON())
        }
    }

    async suggestNewTranslation(params: TranslationSuggestion, profile: ProfileModel) {
        const source = await Database.sources().getById(params.sourceId)
        if ( ! source) {
            console.error("No Source item for id = " + params.sourceId)
            return false;
        };
        const lang = await Database.languages().getByCode(params.languageCode);
        if ( ! lang) {
            console.error("No Language found for code = " + params.languageCode)
            return false;
        };

        let translation = await this.translationRepository.findOne({
            "source": source,
            "language": lang,
        })

        if ( ! translation) {
            translation = this.translationRepository.create({
                "source": source,
                "language": lang,
            })
            await this.translationRepository.save(translation);
        }


        if (profile.role === "contributor") {
            await Database.suggestions().addNewSuggestion(params.value, translation, profile);
        } else if (["admin", "manager"].includes(profile.role)) {
            translation.translation = params.value;
            await this.translationRepository.save(translation);
        }
        return true;
    }
}