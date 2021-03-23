import path from "path";
import { Database } from "../db/Database";
import { LanguageModel } from "../db/models/Language";

console.log("Loading languages...");

const dbPath = path.resolve(__dirname, "..", "db/game.db");
(async () => { 
    const dbConnection = await Database.establishConnection("sqlite3://" + dbPath);

    if (dbConnection === undefined) {
        console.log("Can't connect to db");
        process.exit(1);
    }

    const langs = [
        {"code": "en", "title": "English"},
        {"code": "ru", "title": "Russian"},
        {"code": "fr", "title": "French"},
        {"code": "cn", "title": "Chinese"},
        {"code": "de", "title": "German"},
        {"code": "pl", "title": "Polish"}
    ];

    const langRepo = dbConnection.getRepository(LanguageModel);

    for (const lang of langs) {
        let langRecord = langRepo.create(lang);
        await langRepo.save(langRecord)
    }
})();
