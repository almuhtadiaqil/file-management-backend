import { Repository } from "typeorm";
import { Directory } from "../entities/Directory";
import { AppDataSource } from "../data-source";

export class DirectoryRepository {
    private directoryRepo: Repository<Directory>

    constructor() {
        this.directoryRepo = AppDataSource.manager.getRepository(Directory)
    }

    public async findAll(name: string | null = null, path: string | null = null): Promise<Directory[]> {
        let query = this.directoryRepo.createQueryBuilder("file_management")
        if (name) {
            query.andWhere('file_management.name = :name', { name: name })
        }
        if (path) {
            query.andWhere('file_management.path = :path', { path: path })
        }
        return await query.getMany();
    }

    public async findByName(name: string): Promise<Directory | null> {
        return this.directoryRepo.findOne({ where: { name } });
    }

    public async findByPath(path: string | null = null): Promise<Directory[]> {
        return this.directoryRepo.findBy({path: path?.toString() });
    }

    public async findByParentNameAndPath(name: string, path: string | null = null): Promise<Directory[]> {
        return this.directoryRepo.findBy({ parent_name: name, path: path?.toString() });
    }

    public async findByNameAndParentPath(name: string, parentPath: string): Promise<Directory | null> {
        return this.directoryRepo.findOne({ where: { name, path: parentPath } });
    }

    // Create a new folder
    public async createFolder(name: string, path: string, is_directory: boolean, parent_name?: string): Promise<Directory> {
        const folder = this.directoryRepo.create({ name, path: path, is_directory: is_directory, parent_name: parent_name || null });
        return this.directoryRepo.save(folder);
    }

    // Delete a folder by ID
    public async deleteFolder(id: string): Promise<void> {
        await this.directoryRepo.delete(id);
    }
}