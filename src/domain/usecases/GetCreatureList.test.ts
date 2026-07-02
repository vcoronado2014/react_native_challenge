import { GetCreatureList } from './GetCreatureList';
import { CreatureRepository } from '../repositories/CreatureRepository';
import { CreatureSummary } from '../entities/Creature';

describe('GetCreatureList Use Case', () => {
  let useCase: GetCreatureList;
  let mockRepository: jest.Mocked<CreatureRepository>;

  beforeEach(() => {
    mockRepository = {
      fetchPaginatedList: jest.fn(),
      fetchByDetails: jest.fn(),
    };
    useCase = new GetCreatureList(mockRepository);
  });

  it('should forward limit and offset arguments to the repository layer', async () => {
    const mockData: CreatureSummary[] = [
      { id: '21', name: 'SPEAROW', thumbnail: 'https://fake-url.com/21.png' }
    ];

    mockRepository.fetchPaginatedList.mockResolvedValue(mockData);

    // Simulamos que el hook pide la segunda página
    const result = await useCase.execute(20, 20);

    expect(result).toEqual(mockData);
    expect(mockRepository.fetchPaginatedList).toHaveBeenCalledWith(20, 20);
    expect(mockRepository.fetchPaginatedList).toHaveBeenCalledTimes(1);
  });
});