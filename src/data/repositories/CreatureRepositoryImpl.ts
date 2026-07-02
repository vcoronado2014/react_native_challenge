import { CreatureRepository } from '../../domain/repositories/CreatureRepository';
import { CreatureSummary, CreatureDetail } from '../../domain/entities/Creature';
import { CreatureRemoteDataSource } from '../datasources/CreatureRemoteDataSource';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class CreatureRepositoryImpl implements CreatureRepository {
  private memoryCache = new Map<string, any>();
  private readonly LIST_CACHE_KEY = '@pocket_dex_list_page_';
  private readonly DETAIL_CACHE_KEY = '@pocket_dex_detail_';

  constructor(private remoteDataSource: CreatureRemoteDataSource) {}

  async fetchPaginatedList(limit: number, offset: number): Promise<CreatureSummary[]> {
    const cacheKey = `${limit}_${offset}`;
    
    // Memoria (Para scrolls fluidos de FlatList)
    if (this.memoryCache.has(`list_${cacheKey}`)) {
      return this.memoryCache.get(`list_${cacheKey}`);
    }

    // Almacenamiento Local (Persistencia Física / Modo Offline)
    try {
      const localData = await AsyncStorage.getItem(`${this.LIST_CACHE_KEY}${cacheKey}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        this.memoryCache.set(`list_${cacheKey}`, parsed); // Sincroniza memoria
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading local storage', e);
    }

    // Vamos a la Red (PokeAPI)
    const data = await this.remoteDataSource.getRawList(limit, offset);
    const results = data.results.map((item: any) => {
      const segments = item.url.split('/').filter(Boolean);
      const id = segments[segments.length - 1];
      return {
        id,
        name: item.name.toUpperCase(),
        thumbnail: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });

    // Guardar en ambas capas de caché
    this.memoryCache.set(`list_${cacheKey}`, results);
    try {
      await AsyncStorage.setItem(`${this.LIST_CACHE_KEY}${cacheKey}`, JSON.stringify(results));
    } catch (e) {
      console.error('Error saving data locally', e);
    }

    return results;
  }

  async fetchByDetails(idOrName: string): Promise<CreatureDetail> {
    // Memoria
    if (this.memoryCache.has(`detail_${idOrName}`)) {
      return this.memoryCache.get(`detail_${idOrName}`);
    }

    // Local Storage (Offline)
    try {
      const localDetail = await AsyncStorage.getItem(`${this.DETAIL_CACHE_KEY}${idOrName}`);
      if (localDetail) {
        const parsed = JSON.parse(localDetail);
        this.memoryCache.set(`detail_${idOrName}`, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading local detail storage', e);
    }

    // Red
    const data = await this.remoteDataSource.getRawDetails(idOrName);
    const detail: CreatureDetail = {
      id: data.id.toString(),
      name: data.name.toUpperCase(),
      thumbnail: data.sprites.front_default || '',
      height: data.height,
      weight: data.weight,
      baseExperience: data.base_experience,
      types: data.types.map((t: any) => t.type.name),
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: {
        hp: data.stats[0]?.base_stat || 0,
        attack: data.stats[1]?.base_stat || 0,
        defense: data.stats[2]?.base_stat || 0,
        speed: data.stats[5]?.base_stat || 0,
      }
    };

    this.memoryCache.set(`detail_${idOrName}`, detail);
    try {
      await AsyncStorage.setItem(`${this.DETAIL_CACHE_KEY}${idOrName}`, JSON.stringify(detail));
    } catch (e) {
      console.error('Error caching detail locally', e);
    }

    return detail;
  }
}