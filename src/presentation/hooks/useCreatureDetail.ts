//hook de detalle de criatura, que se encarga de manejar el estado del detalle, el loading y el error
import { useState, useEffect } from 'react';
import { useDependencies } from '../context/DependenciesContext';
import { CreatureDetail } from '../../domain/entities/Creature';

export const useCreatureDetail = () => {
  const { selectedId, getCreatureDetails } = useDependencies();
  const [detail, setDetail] = useState<CreatureDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    
    let isMounted = true;
    setLoading(true);
    setError(null);

    getCreatureDetails.execute(selectedId)
      .then((data) => {
        if (isMounted) setDetail(data);
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
  }, [selectedId, getCreatureDetails]);

  return { detail, loading, error };
};