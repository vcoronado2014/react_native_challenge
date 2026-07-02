import React from 'react';
import { StatusBar, useColorScheme, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { DependenciesProvider, useDependencies } from './src/presentation/context/DependenciesContext';
import { CollectionFeedScreen } from './src/presentation/screen/CollectionFeedScreen';
import { InspectScreen } from './src/presentation/screen/InspectScreen';


function NavigationRouter() {
  const { currentScreen } = useDependencies();

  // Enrutador basado en estado
  switch (currentScreen) {
    case 'DETAILS':
      return <InspectScreen />;
    case 'FEED':
    default:
      return <CollectionFeedScreen />;
  }
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View 
      style={[
        styles.container, 
        { 
          paddingTop: safeAreaInsets.top, 
          paddingBottom: safeAreaInsets.bottom 
        }
      ]}
    >
      <NavigationRouter />
    </View>
  );
}

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <DependenciesProvider>
      <SafeAreaProvider>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor="transparent" 
          translucent 
        />
        <AppContent />
      </SafeAreaProvider>
    </DependenciesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
});
