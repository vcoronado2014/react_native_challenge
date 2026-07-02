import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDependencies } from '../context/DependenciesContext';
import { useCreatureDetail } from '../hooks/useCreatureDetail';

export const InspectScreen = () => {
  const { navigate } = useDependencies();
  const { detail, loading, error } = useCreatureDetail();

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#3182CE" /></View>
    );
  }

  if (error || !detail) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'No existe'}</Text>
        <TouchableOpacity onPress={() => navigate('FEED')} style={styles.bigBackBtn}><Text>Return</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity 
          onPress={() => navigate('FEED')} 
          style={styles.bigBackBtn} 
          activeOpacity={0.6}
          accessible={true}
          accessibilityLabel="Go back to collection archive"
          accessibilityRole="button"
        >
          <Text style={styles.backTxt}> Volver</Text>
        </TouchableOpacity>
        {/* Marcamos el título como un encabezado para lectores de pantalla avanzados */}
        <Text style={styles.navTitle} accessibilityRole="header">Detalles</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.metaCard}>
          <Image 
            source={{ uri: detail.thumbnail }} 
            style={styles.heroImg} 
            accessibilityLabel={`Artwork of ${detail.name}`}
          />
          <Text style={styles.name} accessibilityRole="header">{detail.name}</Text>
          <View style={styles.badgeRow} accessibilityLabel="Creature types">
            {detail.types.map(t => (
              <View key={t} style={styles.tag}><Text style={styles.tagTxt}>{t}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.blockTitle} accessibilityRole="header">Características</Text>
          <View style={styles.grid}>
            <View accessible={true} accessibilityLabel={`Height: ${detail.height / 10} meters`}>
              <Text style={styles.gridItem}>Alto: {detail.height / 10} m</Text>
            </View>
            <View accessible={true} accessibilityLabel={`Weight: ${detail.weight / 10} kilograms`}>
              <Text style={styles.gridItem}>Peso: {detail.weight / 10} kg</Text>
            </View>
            <View accessible={true} accessibilityLabel={`Base experience: ${detail.baseExperience} points`}>
              <Text style={styles.gridItem}>Experiencia: {detail.baseExperience}</Text>
            </View>
          </View>

          <Text style={styles.blockTitle} accessibilityRole="header">Estadísticas de Combate</Text>
          
          <View style={styles.statLine} accessible={true} accessibilityLabel={`Health Points value is ${detail.stats.hp}`}>
            <Text style={styles.statLabel}>HP</Text>
            <Text style={styles.statVal}>{detail.stats.hp}</Text>
          </View>
          <View style={styles.statLine} accessible={true} accessibilityLabel={`Attack power value is ${detail.stats.attack}`}>
            <Text style={styles.statLabel}>ATAQUE</Text>
            <Text style={styles.statVal}>{detail.stats.attack}</Text>
          </View>
          <View style={styles.statLine} accessible={true} accessibilityLabel={`Defense value is ${detail.stats.defense}`}>
            <Text style={styles.statLabel}>DEFENSA</Text>
            <Text style={styles.statVal}>{detail.stats.defense}</Text>
          </View>
          <View style={styles.statLine} accessible={true} accessibilityLabel={`Speed value is ${detail.stats.speed}`}>
            <Text style={styles.statLabel}>VELOCIDAD</Text>
            <Text style={styles.statVal}>{detail.stats.speed}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navBar: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16, 
    height: 56, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  bigBackBtn: { 
    paddingVertical: 12, // Hitbox vertical aumentada para cumplir WCAG (mínimo 48px de alto de toque)
    paddingRight: 16, 
    minWidth: 64,
  },
  backTxt: { color: '#2B6CB0', fontWeight: '700', fontSize: 16 }, // accesibilidad: Azul con mayor contraste (#2B6CB0)
  navTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginLeft: 8 },
  scroll: { paddingBottom: 32 },
  metaCard: { alignItems: 'center', backgroundColor: '#FFF', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  heroImg: { width: 160, height: 160 },
  name: { fontSize: 26, fontWeight: '800', color: '#1A202C', marginVertical: 8 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#EDF2F7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, margin: 4 },
  tagTxt: { color: '#2D3748', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }, // accesibilidad: Contraste aumentado
  statsCard: { padding: 24, margin: 16, backgroundColor: '#FFF', borderRadius: 16, elevation: 1 },
  blockTitle: { fontSize: 15, fontWeight: '800', color: '#4A5568', textTransform: 'uppercase', marginBottom: 12, marginTop: 12 }, // CORREGIDO: Contraste aumentado
  grid: { marginBottom: 16 },
  gridItem: { fontSize: 14, color: '#2D3748', marginVertical: 4 }, // accesibilidad: Contraste aumentado y mayor espaciado
  statLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  statVal: { fontSize: 13, fontWeight: '700', color: '#1A202C' },
  errorText: { color: '#C53030', marginBottom: 12 } 
});