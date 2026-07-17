import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useCreatureCollection } from '../hooks/useCreatureCollection';
import { CreatureRow } from '../components/CreatureRow';
import { useDependencies } from '../context/DependenciesContext';

export const CollectionFeedScreen = () => {
  // Extraemos 'favoriteIds' de tu hook actualizado
  const { items, loading, loadingMore, error, loadMore, favoriteIds } = useCreatureCollection();
  const { navigate } = useDependencies();

  // Estado local para controlar el filtro de favoritos
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Interceptamos la data: si el botón está activo, filtramos en memoria por ID
  const displayedItems = showFavoritesOnly
    ? items.filter(item => favoriteIds.includes(item.id))
    : items;

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
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.title}>Listado de Pokemons</Text>
            <Text style={styles.subtitle}>Descubre y explora la colección</Text>
          </View>

          {/* 🌟 Botón de filtro dinámico */}
          <TouchableOpacity
            onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            style={[styles.filterBtn, showFavoritesOnly ? styles.filterBtnActive : styles.filterBtnInactive]}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel={showFavoritesOnly ? "Mostrando solo favoritos. Haz clic para mostrar todos." : "Mostrando todos. Haz clic para filtrar favoritos."}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: showFavoritesOnly }}
          >
            <Text style={[styles.filterBtnTxt, showFavoritesOnly ? styles.filterTxtActive : styles.filterTxtInactive]}>
              {showFavoritesOnly ? '⭐ Favoritos' : '☆ Todos'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={displayedItems} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rowWrapper}>
            <CreatureRow item={item} onPress={(id) => navigate('DETAILS', id)} />
            {/* Opcional: agregamos un indicador de estrella si el item es favorito */}
            {favoriteIds.includes(item.id) && <Text style={styles.starIndicator}>⭐</Text>}
          </View>
        )}
        contentContainerStyle={styles.list}
        onEndReached={showFavoritesOnly ? null : loadMore} // Desactivamos el scroll infinito si solo miramos favoritos locales
        onEndReachedThreshold={0.5} 
        ListFooterComponent={() => (
          loadingMore && !showFavoritesOnly ? <ActivityIndicator style={styles.footerSpinner} size="small" color="#3182CE" /> : null
        )}
        ListEmptyComponent={() => (
          showFavoritesOnly ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No has añadido ningún Pokémon a tus favoritos todavía.</Text>
            </View>
          ) : null
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
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A202C' },
  subtitle: { fontSize: 13, color: '#718096', marginTop: 2 },
  list: { paddingVertical: 8 },
  errorText: { color: '#E53E3E', fontWeight: '500' },
  footerSpinner: { paddingVertical: 16 },
  
  /* 🌟 Estilos del filtro de favoritos */
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: { backgroundColor: '#FFFAF0', borderColor: '#DD6B20' },
  filterBtnInactive: { backgroundColor: '#EDF2F7', borderColor: '#CBD5E0' },
  filterBtnTxt: { fontSize: 12, fontWeight: '700' },
  filterTxtActive: { color: '#DD6B20' },
  filterTxtInactive: { color: '#4A5568' },
  
  rowWrapper: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  starIndicator: { position: 'absolute', right: 45, fontSize: 16 }, // Ajusta el 'right' según el margen de tu CreatureRow
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyTxt: { color: '#718096', fontSize: 14, textAlign: 'center', fontWeight: '500' }
});