import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useDependencies } from '../context/DependenciesContext';
import { useCreatureDetail } from '../hooks/useCreatureDetail';

export const InspectScreen = () => {

    const { navigate } = useDependencies();
    // 🌟 Destructuramos las nuevas propiedades desde tu hook actualizado
    const { detail, loading, error, isFavorite, toggleFavorite } = useCreatureDetail();

    if (loading) {
        return (
            <View style={styles.center}><ActivityIndicator size="large" color="#3182CE" /></View>
        );
    }

    if (error || !detail) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error || 'Entidad no localizada'}</Text>
                <TouchableOpacity onPress={() => navigate('FEED')} style={styles.bigBackBtn}><Text style={styles.backTxt}>← Volver</Text></TouchableOpacity>
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
                    accessibilityLabel="Volver al listado"
                    accessibilityRole="button"
                >
                    <Text style={styles.backTxt}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.navTitle} accessibilityRole="header">Detalles</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.metaCard}>
                    <Image
                        source={{ uri: detail.thumbnail }}
                        style={styles.heroImg}
                        accessibilityLabel={`Artwork representation of ${detail.name}`}
                    />
                    <Text style={styles.name} accessibilityRole="header">{detail.name}</Text>
                    <View style={styles.badgeRow} accessibilityLabel="Creature categories">
                        {detail.types.map(t => (
                            <View key={t} style={styles.tag}><Text style={styles.tagTxt}>{t}</Text></View>
                        ))}
                    </View>

                    {/* 🌟 NUEVO: Botón de Favoritos dinámico con accesibilidad */}
                    <TouchableOpacity 
                        onPress={toggleFavorite}
                        style={[styles.favBtn, isFavorite ? styles.favBtnActive : styles.favBtnInactive]}
                        activeOpacity={0.7}
                        accessible={true}
                        accessibilityLabel={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                        accessibilityRole="button"
                    >
                        <Text style={[styles.favBtnTxt, isFavorite ? styles.favTxtActive : styles.favTxtInactive]}>
                            {isFavorite ? '⭐ En Favoritos' : '☆ Añadir a Favoritos'}
                        </Text>
                    </TouchableOpacity>
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
                        <View accessible={true} accessibilityLabel={`Base experience: ${detail.baseExperience} base points`}>
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
                    <View style={styles.statLine} accessible={true} accessibilityLabel={`Defense modifier value is ${detail.stats.defense}`}>
                        <Text style={styles.statLabel}>DEFENSA</Text>
                        <Text style={styles.statVal}>{detail.stats.defense}</Text>
                    </View>
                    <View style={styles.statLine} accessible={true} accessibilityLabel={`Speed metric value is ${detail.stats.speed}`}>
                        <Text style={styles.statLabel}>VELOCIDAD</Text>
                        <Text style={styles.statVal}>{detail.stats.speed}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 12,
        paddingBottom: 12,
    },
    bigBackBtn: {
        paddingVertical: 8,
        paddingRight: 16,
        minWidth: 64,
    },
    navTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A202C',
        marginLeft: 8,
        alignSelf: 'center'
    },
  backTxt: { color: '#2B6CB0', fontWeight: '700', fontSize: 16 },
  scroll: { paddingBottom: 32 },
  metaCard: { alignItems: 'center', backgroundColor: '#FFF', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  heroImg: { width: 160, height: 160 },
  name: { fontSize: 26, fontWeight: '800', color: '#1A202C', marginVertical: 8 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#EDF2F7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, margin: 4 },
  tagTxt: { color: '#2D3748', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  
  /* 🌟 NUEVOS ESTILOS AGREGADOS PARA EL BOTÓN DE FAVORITOS */
  favBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    width: '80%',
    alignItems: 'center',
  },
  favBtnActive: {
    backgroundColor: '#FFFAF0',
    borderColor: '#DD6B20',
  },
  favBtnInactive: {
    backgroundColor: '#FFF',
    borderColor: '#CBD5E0',
  },
  favBtnTxt: {
    fontSize: 14,
    fontWeight: '700',
  },
  favTxtActive: {
    color: '#DD6B20',
  },
  favTxtInactive: {
    color: '#4A5568',
  },

  statsCard: { padding: 24, margin: 16, backgroundColor: '#FFF', borderRadius: 16, elevation: 1 },
  blockTitle: { fontSize: 15, fontWeight: '800', color: '#4A5568', textTransform: 'uppercase', marginBottom: 12, marginTop: 12 },
  grid: { marginBottom: 16 },
  gridItem: { fontSize: 14, color: '#2D3748', marginVertical: 4 },
  statLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  statVal: { fontSize: 13, fontWeight: '700', color: '#1A202C' },
  errorText: { color: '#C53030', marginBottom: 12 }
});