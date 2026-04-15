import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Searchbar,
} from 'react-native-paper';
import { searchItems, getItemIconUrl } from '../../utils/minecraftApi';
import { useMinecraftItems } from '../../Context/MinecraftContext';
import { useRenderItems } from '../../Context/RenderContext';

export default function MinecraftItems({ navigation }) {
  const { items, loading, error } = useMinecraftItems();
  const { addItemToRender } = useRenderItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'No se pudo cargar los items: ' + error);
    }
  }, [error]);

  const filteredItems = searchItems(items, searchQuery);

  const handleImageError = (itemId) => {
    console.log('Error loading image for item:', itemId);
    setFailedImages(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const handleViewInfo = (item) => {
    navigation.navigate('ItemDetails', { item });
  };

  const handleAddToRender = (item) => {
    addItemToRender(item);
    Alert.alert('Éxito', `${item.name} agregado a Render`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loadingText}>Cargando items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar items..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No se encontraron items</Text>
          </View>
        ) : (
          filteredItems.map((item, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.itemHeader}>
                  <View style={styles.iconWrapper}>
                    {getItemIconUrl(item.itemId || item.name) && !failedImages[item.id] ? (
                      <Image
                        source={{ uri: getItemIconUrl(item.itemId || item.name) }}
                        style={styles.itemIcon}
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <Text style={styles.iconPlaceholder}>⬜</Text>
                    )}
                  </View>
                  <View style={styles.itemInfo}>
                    <Text variant="titleMedium" style={styles.itemName}>
                      {item.name}
                    </Text>
                    {item.displayName && (
                      <Text variant="bodySmall" style={styles.itemDescription}>
                        {item.displayName}
                      </Text>
                    )}
                    {item.id && (
                      <Text variant="bodySmall" style={styles.itemId}>
                        ID: {item.id}
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
              <Card.Actions style={styles.cardActions}>
                <Button 
                  onPress={() => handleAddToRender(item)}
                  mode="contained"
                  buttonColor="#4CAF50"
                  textColor="#ffffff"
                  style={styles.actionPrimaryButton}
                  labelStyle={styles.actionPrimaryLabel}
                >
                  Render
                </Button>
                <Button 
                  onPress={() => handleViewInfo(item)}
                  mode="contained"
                  textColor="#111111"
                  buttonColor="#FBC02D"
                  style={styles.actionSecondaryButton}
                  labelStyle={styles.actionSecondaryLabel}
                >
                  Info
                </Button>
              </Card.Actions>
            </Card>
          ))
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
  searchbar: {
    margin: 10,
    borderWidth: 3,
    borderColor: '#111111',
    borderRadius: 0,
    backgroundColor: '#a65e2e',
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
  iconPlaceholder: {
    fontSize: 32,
    color: '#8D6E63',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#ffffff',
  },
  itemId: {
    color: '#f3e2d2',
    fontSize: 14,
  },
  itemDescription: {
    color: '#f3e2d2',
    fontSize: 14,
  },
  cardActions: {
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  actionPrimaryButton: {
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
    minWidth: 130,
  },
  actionPrimaryLabel: {
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  actionSecondaryButton: {
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
    minWidth: 100,
  },
  actionSecondaryLabel: {
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
