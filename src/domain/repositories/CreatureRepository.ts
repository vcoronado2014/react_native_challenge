import { CreatureSummary, CreatureDetail } from '../entities/Creature';

export interface CreatureRepository {
  fetchPaginatedList(limit: number, offset: number): Promise<CreatureSummary[]>;
  fetchByDetails(idOrName: string): Promise<CreatureDetail>;
}