//hook de detalle de criatura, que se encarga de manejar el estado del detalle, el loading y el error
import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '../context/DependenciesContext';
import { CreatureDetail } from '../../domain/entities/Creature';

export const useCreatureDetail = () => {
  // 🌟 Extraemos tus casos de uso reales directamente desde tu contexto
  const { selectedId, getCreatureDetails, esFavorito, agregarFavorito } = useDependencies();
  
  const [detail, setDetail] = useState<CreatureDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsfavorite] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedId) return;
    
    let isMounted = true;
    setLoading(true);
    setError(null);
    setDetail(null); 
    setIsfavorite(false);

    // 1. Cargamos el detalle del Pokémon
    getCreatureDetails.execute(selectedId)
      .then((data) => {
        if (isMounted) {
          setDetail(data);
        }
        // 2. 🌟 Usamos tu caso de uso real "esFavorito"
        return esFavorito.execute(selectedId);
      })
      .then((favStatus) => {
        if (isMounted) {
          setIsfavorite(favStatus); // Seteamos el estado booleano
        }
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : 'Error de detalle desconocido');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedId, getCreatureDetails, esFavorito]);

  // 3. 🌟 Función para el botón usando tu caso de uso "agregarFavorito"
  const toggleFavorite = useCallback(async () => {
    if (!selectedId) return;
    try {
      const newFavStatus = await agregarFavorito.execute(selectedId);
      setIsfavorite(newFavStatus); // Actualiza la UI con lo que devuelva el repositorio
    } catch (err) {
      console.error('Error al alternar favorito:', err);
    }
  }, [selectedId, agregarFavorito]);

  return { 
    detail, 
    loading, 
    error, 
    isFavorite, 
    toggleFavorite 
  };
};