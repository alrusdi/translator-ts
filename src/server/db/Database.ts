import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { LanguageService } from "../services/Language";
import { ProfileService } from "../services/Profile";
import { SourceService } from "../services/Source";
import { SuggestionService } from "../services/Suggestion";
import { TranslationService } from "../services/Translations";
import { LanguageModel } from "./models/Language";
import { ProfileModel } from "./models/Profile";
import { SourceModel } from "./models/Source";
import { SuggestionModel } from "./models/Suggestion";
import { TranslationModel } from "./models/Translation";

function ensureConnection(target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        if ( ! target.hasConnection()) {
            throw Error("Must establishConnection first")
        }
        let result = originalMethod.apply(this, args);
        return result;
    }

}

export class Database {
    private static connection: Connection;

    private static parseConnectionOptions(connectionString: string): ConnectionOptions {
        var connectionOptions: ConnectionOptions;
        const entities = [ProfileModel, LanguageModel, SourceModel, SuggestionModel, TranslationModel];
        if (connectionString.startsWith("sqlite3://")) {
            connectionOptions = {
                type: "sqlite",
                database: connectionString.substring("sqlite3://".length),
                entities: entities,
                synchronize: true
            }
        } else {
            connectionOptions = {
                type: "postgres",
                url: connectionString,
                entities: entities,
                synchronize: true
            }
        }
        return connectionOptions;
    }

    static async establishConnection (connectionString: string) {
        try {
            const connectionOptions = Database.parseConnectionOptions(connectionString);
            Database.connection = await createConnection(connectionOptions);
            return Database.connection;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    static hasConnection() {
        return Database.connection !== undefined;
    }

    @ensureConnection
    static profiles () {
        const repository = Database.connection.getRepository(ProfileModel);
        return new ProfileService(repository)
    }

    @ensureConnection
    static translations () {
        const sourceRepository = Database.connection.getRepository(SourceModel);
        const translationRepository = Database.connection.getRepository(TranslationModel);
        return new TranslationService(translationRepository, sourceRepository)
    }

    @ensureConnection
    static languages () {
        const repository = Database.connection.getRepository(LanguageModel);
        return new LanguageService(repository)
    }

    @ensureConnection
    static sources () {
        const repository = Database.connection.getRepository(SourceModel);
        return new SourceService(repository)
    }

    @ensureConnection
    static suggestions () {
        const repository = Database.connection.getRepository(SuggestionModel);
        return new SuggestionService(repository)
    }

}