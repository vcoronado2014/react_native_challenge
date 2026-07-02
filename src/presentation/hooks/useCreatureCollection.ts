
//hook de la colección de criaturas, que se encarga de manejar el estado de la lista, el loading y el error
import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '../context/DependenciesContext';
import { CreatureSummary } from '../../domain/entities/Creature';

export const useCreatureCollection = () => {
    const { getCreatureList } = useDependencies();
    const [items, setItems] = useState<CreatureSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
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

    // Carga la siguiente página (Infinite Scroll)
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

    useEffect(() => {
        loadCollection();
    }, [loadCollection]);

    return { items, loading, loadingMore, error, refresh: loadCollection, loadMore };
};
