import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { getItemCategories, filterItemsByType, getItemIconUrl } from '../../utils/minecraftApi';
import { useMinecraftItems } from '../../Context/MinecraftContext';
import { useRenderItems } from '../../Context/RenderContext';

export default function MinecraftRender({ navigation }) {
  const { items, loading } = useMinecraftItems();
  const { renderItems, removeItemFromRender, clearRenderItems } = useRenderItems();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageErrors, setImageErrors] = useState({});

  const displayItems = renderItems.length > 0 ? renderItems : items;
  const categories = useMemo(() => getItemCategories(displayItems), [displayItems]);
  const filteredItems = useMemo(
    () => filterItemsByType(displayItems, selectedCategory),
    [displayItems, selectedCategory]
  );

  const handleRemoveFromRender = (itemId) => {
    removeItemFromRender(itemId);
    Alert.alert('Removido', 'Item retirado de renderizado');
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar',
      '¿Deseas limpiar todos los items de renderizado?',
      [
        { text: 'Cancelar', onPress: () => {} },
        { 
          text: 'Limpiar', 
          onPress: () => {
            clearRenderItems();
            Alert.alert('Éxito', 'Todos los items han sido removidos');
          }
        }
      ]
    );
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  if (loading && renderItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loadingText}>Cargando renderizados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="bodyMedium" style={styles.header}>
          {renderItems.length > 0 ? `Items seleccionados: ${renderItems.length}` : 'Selecciona items para renderizar'}
        </Text>
        {renderItems.length > 0 && (
          <Button 
            mode="contained"
            compact
            buttonColor="#C62828"
            textColor="#ffffff"
            icon="delete-sweep"
            onPress={handleClearAll}
            style={styles.clearButton}
            labelStyle={styles.clearButtonLabel}
          >
            Limpiar
          </Button>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category, index) => (
          <Chip
            key={index}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.chip,
              category === 'all' ? styles.allChip : styles.greenChip,
              selectedCategory === category && styles.selectedChip,
            ]}
            textStyle={styles.chipText}
            compact
            mode={selectedCategory === category ? 'flat' : 'outlined'}
          >
            {category === 'all' ? 'Todos' : category}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.gridContent}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {renderItems.length === 0 
                ? 'No hay items. Ve a Items y selecciona algunos para renderizar'
                : 'No hay items en esta categoría'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('RenderDetail', { item })}
              >
                <Card style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.itemHeader}>
                      <View style={styles.iconWrapper}>
                        {imageErrors[item.id] ? (
                          <Text style={styles.placeholderIcon}>⬜</Text>
                        ) : (
                          <Image
                            source={{ uri: getItemIconUrl(item.itemId || item.name) }}
                            style={styles.itemIcon}
                            onError={() => handleImageError(item.id)}
                          />
                        )}
                      </View>
                      <View style={styles.itemInfo}>
                        <Text 
                          variant="titleMedium" 
                          style={styles.itemName}
                        >
                          {item.name}
                        </Text>
                        {item.displayName && (
                          <Text variant="bodySmall" style={styles.itemDescription}>
                            {item.displayName}
                          </Text>
                        )}
                        {item.maxStackSize && (
                          <Text variant="bodySmall" style={styles.itemDescription}>
                            Stack: {item.maxStackSize}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Card.Content>
                  {renderItems.find(i => i.id === item.id) && (
                    <Card.Actions style={styles.removeActions}>
                      <Button
                        mode="contained"
                        compact
                        buttonColor="#C62828"
                        textColor="#ffffff"
                        style={styles.removeButton}
                        labelStyle={styles.removeButtonLabel}
                        icon="close"
                        onPress={() => handleRemoveFromRender(item.id)}
                      >
                        Remover
                      </Button>
                    </Card.Actions>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  categoriesScroll: {
    maxHeight: 70,
    marginBottom: 10,
  },
  categoriesContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
    alignItems: 'center',
  },
  chip: {
    minWidth: 92,
    height: 42,
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allChip: {
    backgroundColor: '#ffffff',
  },
  greenChip: {
    backgroundColor: '#A5D6A7',
  },
  selectedChip: {
    backgroundColor: '#81C784',
  },
  chipText: {
    color: '#111111',
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  gridContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  listContainer: {
    paddingVertical: 10,
  },
  card: {
    marginBottom: 12,
    elevation: 0,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#0b0b0b',
    backgroundColor: '#6f3208',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9a977',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#111111',
  },
  itemIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#ffffff',
  },
  itemDescription: {
    color: '#f3e2d2',
    fontSize: 14,
  },
  placeholderIcon: {
    fontSize: 32,
    color: '#ccc',
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8b4513',
    borderBottomWidth: 4,
    borderBottomColor: '#5c2e0d',
  },
  header: {
    fontWeight: '900',
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: 0.8,
  },
  clearButton: {
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
  },
  clearButtonLabel: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  removeActions: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: 'flex-end',
    backgroundColor: '#5a1f0f',
    borderTopWidth: 2,
    borderTopColor: '#3a1000',
  },
  removeButton: {
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
  },
  removeButtonLabel: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
