import { CreatureRepository } from "../repositories/CreatureRepository";
export class EsFavorito {
    constructor(private repository: CreatureRepository){}

    async execute(id:string): Promise<boolean>{
        return await this.repository.esFavorito(id);
    }
}