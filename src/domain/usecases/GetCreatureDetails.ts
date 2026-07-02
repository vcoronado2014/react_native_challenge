import { CreatureRepository } from '../repositories/CreatureRepository';
import { CreatureDetail } from '../entities/Creature';

export class GetCreatureDetails {
  constructor(private repository: CreatureRepository) {}

  async execute(idOrName: string): Promise<CreatureDetail> {
    return await this.repository.fetchByDetails(idOrName);
  }
}