import React from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useCreatureCollection } from '../hooks/useCreatureCollection';
import { CreatureRow } from '../components/CreatureRow';
import { useDependencies } from '../context/DependenciesContext';

export const CollectionFeedScreen = () => {
  // Traemos 'loadMore' y 'loadingMore' del hook actualizado
  const { items, loading, loadingMore, error, loadMore } = useCreatureCollection();
  const { navigate } = useDependencies();

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#3182CE" /></View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Listado de Pokemons</Text>
        <Text style={styles.subtitle}>Descubre y explora la colección de Pokemons</Text>
      </View>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CreatureRow item={item} onPress={(id) => navigate('DETAILS', id)} />
        )}
        contentContainerStyle={styles.list}
        onEndReached={loadMore} 
        onEndReachedThreshold={0.5} 
        ListFooterComponent={() => (
          loadingMore ? <ActivityIndicator style={styles.footerSpinner} size="small" color="#3182CE" /> : null
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFC' },
  header: { padding: 24, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  title: { fontSize: 26, fontWeight: '800', color: '#1A202C' },
  subtitle: { fontSize: 13, color: '#718096', marginTop: 2 },
  list: { paddingVertical: 8 },
  errorText: { color: '#E53E3E', fontWeight: '500' },
  footerSpinner: { paddingVertical: 16 } // Margen para el spinner de abajo
});