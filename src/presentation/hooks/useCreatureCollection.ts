//hook de la colección de criaturas, que se encarga de manejar el estado de la lista, el loading y el error
import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '../context/DependenciesContext';
import { CreatureSummary } from '../../domain/entities/Creature';

export const useCreatureCollection = () => {
    // 🌟 1. Extraemos esFavorito y currentScreen de las dependencias
    const { getCreatureList, esFavorito, currentScreen } = useDependencies();
    const [items, setItems] = useState<CreatureSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    // 🌟 2. Nuevo estado para almacenar los IDs que son favoritos actuales
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const PAGE_SIZE = 20;

    // Carga inicial o reinicio
    const loadCollection = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCreatureList.execute(PAGE_SIZE, 0);
            setItems(data);
            setOffset(PAGE_SIZE); // El próximo lote arranca en 20
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown tracking error');
        } finally {
            setLoading(false);
        }
    }, [getCreatureList]);

    // Carga la siguiente página (Infinite Scroll) de forma segura
    const loadMore = useCallback(async () => {
        // 1. CONTROL DE GUARDIA: Si ya está cargando, abortamos inmediatamente
        if (loading || loadingMore) return;

        try {
            setLoadingMore(true);
            const nextData = await getCreatureList.execute(PAGE_SIZE, offset);

            if (nextData.length > 0) {
                setItems(prev => {
                    const allItems = [...prev, ...nextData];

                    // para evitar duplicados
                    const uniqueItemsMap = new Map();
                    allItems.forEach(item => {
                        uniqueItemsMap.set(item.id, item);
                    });

                    return Array.from(uniqueItemsMap.values());
                });

                setOffset(prev => prev + PAGE_SIZE);
            }
        } catch (err) {
            console.error('Error loading more items:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [getCreatureList, loading, loadingMore, offset]);

    // 🌟 3. EFECTO SECUNDARIO: Cada vez que 'items' cambie, consultamos asíncronamente cuáles de ellos son favoritos
    useEffect(() => {
        if (items.length === 0) {
            setFavoriteIds([]);
            return;
        }

        let isMounted = true;

        const checkFavorites = async () => {
            try {
                // Evaluamos concurrentemente los IDs actuales contra AsyncStorage
                const results = await Promise.all(
                    items.map(async (item) => {
                        const isFav = await esFavorito.execute(item.id);
                        return { id: item.id, isFav };
                    })
                );

                if (isMounted) {
                    const activeFavs = results.filter(r => r.isFav).map(r => r.id);
                    setFavoriteIds(activeFavs);
                }
            } catch (err) {
                console.error('Error actualizando lista de favoritos:', err);
            }
        };

        checkFavorites();

        return () => {
            isMounted = false;
        };
    }, [items, esFavorito]);

    // 🌟 4. RE-SINCRONIZACIÓN: Si el usuario sale a detalles y modifica favoritos, volvemos a evaluar al regresar al FEED
    useEffect(() => {
        if (currentScreen === 'FEED' && items.length > 0) {
            // Esto forzará la ejecución del useEffect de arriba para sincronizar los estados visuales
            setItems(prev => [...prev]);
        }
    }, [currentScreen]);

    useEffect(() => {
        loadCollection();
    }, [loadCollection]);

    // 🌟 5. Exponemos favoriteIds para que la vista pueda filtrar y pintar indicadores
    return { 
        items, 
        loading, 
        loadingMore, 
        error, 
        favoriteIds, 
        refresh: loadCollection, 
        loadMore 
    };
};