import { CreatureRepository } from '../repositories/CreatureRepository';
import { CreatureSummary } from '../entities/Creature';

export class GetCreatureList {
  constructor(private repository: CreatureRepository) {}

  //requerido en la premisa 20 como limite y 0 como offset, pero se pueden pasar otros valores
  async execute(limit: number = 20, offset: number = 0): Promise<CreatureSummary[]> {
    return await this.repository.fetchPaginatedList(limit, offset);
  }
}