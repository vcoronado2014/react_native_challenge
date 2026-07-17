import { CreatureRepository } from "../repositories/CreatureRepository";
export class AgregarFavorite {
    constructor(private repository: CreatureRepository){}

    async execute(id:string): Promise<boolean>{
        return await this.repository.agregarFavoritos(id);
    }
}