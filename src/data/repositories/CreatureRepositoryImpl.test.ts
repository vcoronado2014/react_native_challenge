import { CreatureRepositoryImpl } from './CreatureRepositoryImpl';
import { CreatureRemoteDataSource } from '../datasources/CreatureRemoteDataSource';

describe('CreatureRepositoryImpl - Pagination & Memory Cache', () => {
  let repository: CreatureRepositoryImpl;
  let mockDataSource: jest.Mocked<CreatureRemoteDataSource>;

  beforeEach(() => {
    mockDataSource = {
      getRawList: jest.fn(),
      getRawDetails: jest.fn(),
    } as any;

    repository = new CreatureRepositoryImpl(mockDataSource);
  });

  it('should map data, support offset pagination and hit the cache on duplicate calls', async () => {
    // Mock (limit 20, offset 0)
    const mockPageOne = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
      ]
    };

    // Mock (limit 20, offset 20)
    const mockPageTwo = {
      results: [
        { name: 'mew', url: 'https://pokeapi.co/api/v2/pokemon/151/' }
      ]
    };

    mockDataSource.getRawList
      .mockResolvedValueOnce(mockPageOne)
      .mockResolvedValueOnce(mockPageTwo);

    // Pedimos la primera página
    const resPageOne = await repository.fetchPaginatedList(20, 0);
    expect(resPageOne).toEqual([
      { id: '1', name: 'BULBASAUR', thumbnail: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' }
    ]);

    // Pedimos la segunda página (Verifica el offset)
    const resPageTwo = await repository.fetchPaginatedList(20, 20);
    expect(resPageTwo).toEqual([
      { id: '151', name: 'MEW', thumbnail: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png' }
    ]);
    expect(mockDataSource.getRawList).toHaveBeenCalledTimes(2);

    // Volvemos a pedir la página uno para verificar que se use la cache
    const resCachePageOne = await repository.fetchPaginatedList(20, 0);
    expect(resCachePageOne).toEqual(resPageOne);
    expect(mockDataSource.getRawList).toHaveBeenCalledTimes(2);
  });
});