//mi componente para mostrar el pokemon en la lista, con su imagen, nombre y número de pokedex
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { CreatureSummary } from '../../domain/entities/Creature';

interface Props {
  item: CreatureSummary;
  onPress: (id: string) => void;
}

export const CreatureRow = React.memo(({ item, onPress }: Props) => {
  // Construimos una etiqueta descriptiva y clara para el lector de pantalla
  const labelText = `Creature number ${item.id}, named ${item.name}. Double tap to inspect details.`;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(item.id)} 
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={labelText}
      accessibilityRole="button"
    >
      {/* Marcamos la imagen como ignorada por el lector si es meramente decorativa, o le damos su etiqueta */}
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.sprite} 
        accessibilityLabel={`${item.name} sprite`}
      />
      <View style={styles.info}>
        <Text style={styles.index}>Número: {item.id.padStart(2, '0')}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      {/* Ocultamos la flecha decorativa para el lector de pantalla para evitar ruido */}
      <Text style={styles.arrow} importantForAccessibility="no">></Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    minHeight: 56,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  sprite: { width: 55, height: 55, backgroundColor: '#F8F9FA', borderRadius: 28 },
  info: { flex: 1, marginLeft: 16 },
  index: { 
    fontSize: 12, 
    color: '#4A5568', 
    fontWeight: '700' 
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', letterSpacing: 0.3 },
  arrow: { fontSize: 20, color: '#718096', fontWeight: '700' }, // accesibilidad: contraste aumentado
});

