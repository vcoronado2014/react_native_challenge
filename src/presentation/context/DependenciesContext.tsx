//en esta implementación aplicamos 
//imyección de dependencias, desacoplamiento, performance
import React, { createContext, useContext, useMemo, useState } from 'react';
import { AppStack } from '../../domain/entities/Creature';
import { CreatureRemoteDataSource } from '../../data/datasources/CreatureRemoteDataSource';
import { CreatureRepositoryImpl } from '../../data/repositories/CreatureRepositoryImpl';
import { GetCreatureList } from '../../domain/usecases/GetCreatureList';
import { GetCreatureDetails } from '../../domain/usecases/GetCreatureDetails';
import { EsFavorito } from '../../domain/usecases/EsFavorito';
import { AgregarFavorite } from '../../domain/usecases/AgregarFavorito';


interface NavigationState {
  currentScreen: AppStack;
  selectedId: string | null;
  navigate: (screen: AppStack, id?: string) => void;
}

interface Dependencies extends NavigationState {
  getCreatureList: GetCreatureList;
  getCreatureDetails: GetCreatureDetails;
  agregarFavorito: AgregarFavorite;
  esFavorito: EsFavorito;
}

const DependenciesContext = createContext<Dependencies | null>(null);

export const DependenciesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  
  const [nav, setNav] = useState<{ screen: AppStack; id: string | null }>({
    screen: 'FEED',
    id: null,
  });

  const dependencies = useMemo(() => {
    const remoteDS = new CreatureRemoteDataSource();
    const repo = new CreatureRepositoryImpl(remoteDS);


    return {
      getCreatureList: new GetCreatureList(repo),
      getCreatureDetails: new GetCreatureDetails(repo),
      agregarFavorito: new AgregarFavorite(repo),
      esFavorito: new EsFavorito(repo),
      currentScreen: nav.screen,
      selectedId: nav.id,
      navigate: (screen: AppStack, id?: string) => setNav({ screen, id: id || null }),
    };
  }, [nav]);

  return (
    <DependenciesContext.Provider value={dependencies}>
      {children}
    </DependenciesContext.Provider>
  );
};

export const useDependencies = () => {
  const context = useContext(DependenciesContext);
  if (!context) throw new Error('Missing DependenciesProvider');
  return context;
};

