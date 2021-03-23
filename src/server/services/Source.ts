
import { Repository } from "typeorm";
import { SourceModel } from "../db/models/Source";

export class SourceService {

    private repository;

    constructor (databaseRepository: Repository<SourceModel>) {
        this.repository = databaseRepository
    }

    async getAll() {
        return await this.repository.find();
    }

    async getById(sourceId: number) {
        return await this.repository.findOne({"id": sourceId});
    }
}