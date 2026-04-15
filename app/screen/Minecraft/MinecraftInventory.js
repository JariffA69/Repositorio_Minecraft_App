import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, FlatList, TouchableOpacity, Image } from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  TextInput,
  Dialog,
  Portal,
  List,
  Searchbar,
} from 'react-native-paper';
import { useMinecraftItems } from '../../Context/MinecraftContext';
import { getItemIconUrl } from '../../utils/minecraftApi';

export default function MinecraftInventory() {
  const { items, loading } = useMinecraftItems();
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newInventory, setNewInventory] = useState({
    name: '',
    slots: 27,
  });
  const [showForm, setShowForm] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    if (!loading && items.length > 0) {
      setInventories([
        { id: 1, name: 'Inventario Principal', slots: 36, items: Array(36).fill(null) },
        { id: 2, name: 'Cofre 1', slots: 27, items: Array(27).fill(null) },
        { id: 3, name: 'Cofre 2', slots: 27, items: Array(27).fill(null) },
      ]);
    }
  }, [loading, items]);

  const addInventory = () => {
    if (!newInventory.name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el inventario');
      return;
    }
    const slots = parseInt(newInventory.slots) || 27;
    const inventory = {
      id: inventories.length + 1,
      name: newInventory.name,
      slots,
      items: Array(slots).fill(null),
    };
    setInventories(prev => [...prev, inventory]);
    setNewInventory({ name: '', slots: 27 });
    setShowForm(false);
    Alert.alert('Éxito', 'Inventario creado correctamente');
  };

  const deleteInventory = (id) => {
    setInventories(prev => prev.filter(inv => inv.id !== id));
  };

  const addItemToSlot = (invId, slotIndex, item) => {
    setInventories(prevInv =>
      prevInv.map(inv => {
        if (inv.id === invId) {
          const newItems = [...inv.items];
          newItems[slotIndex] = item;
          return { ...inv, items: newItems };
        }
        return inv;
      })
    );
    setShowItemSelector(false);
    setSelectedSlot(null);
    setSearchQuery('');
  };

  const removeItemFromSlot = (invId, slotIndex) => {
    setInventories(prevInv =>
      prevInv.map(inv => {
        if (inv.id === invId) {
          const newItems = [...inv.items];
          newItems[slotIndex] = null;
          return { ...inv, items: newItems };
        }
        return inv;
      })
    );
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showInventoryDetails = (inventory) => {
    setSelectedInventory(inventory);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedInventory(null);
  };

  const RenderInventoryGrid = ({ inventory }) => {
    const gridItems = [];
    for (let i = 0; i < inventory.slots; i++) {
      const item = inventory.items[i];
      gridItems.push(
        <TouchableOpacity
          key={i}
          style={styles.inventorySlot}
          onPress={() => {
            if (!item) {
              setSelectedSlot(i);
              setSelectedInventory(inventory);
              setShowItemSelector(true);
            } else {
              Alert.alert(
                'Opciones',
                `${item.name}`,
                [
                  {
                    text: 'Remover',
                    onPress: () => removeItemFromSlot(inventory.id, i),
                  },
                  { text: 'Cancelar', onPress: () => {} },
                ]
              );
            }
          }}
        >
          {item ? (
            <View style={styles.filledSlot}>
              {imageErrors[item.id] ? (
                <Text style={styles.slotItemText} numberOfLines={1}>
                  {item.name?.substring(0, 2).toUpperCase()}
                </Text>
              ) : (
                <Image
                  source={{ uri: getItemIconUrl(item.itemId || item.name) }}
                  style={styles.slotIcon}
                  onError={() => handleImageError(item.id)}
                />
              )}
            </View>
          ) : (
            <View style={styles.emptySlot} />
          )}
        </TouchableOpacity>
      );
    }
    return <View style={styles.inventoryGrid}>{gridItems}</View>;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loadingText}>Cargando inventarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button
          mode="contained"
          onPress={() => setShowForm(!showForm)}
          buttonColor={showForm ? '#C62828' : '#4CAF50'}
          textColor="#ffffff"
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
          icon={showForm ? 'close' : 'plus'}
        >
          {showForm ? 'Cancelar' : 'Crear Inventario'}
        </Button>

        {showForm && (
          <Card style={styles.formCard}>
            <Card.Content>
              <View style={styles.formTitleRow}>
                <Text variant="titleLarge" style={styles.formTitle}>
                  📦 Nuevo Inventario
                </Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre</Text>
                <TextInput
                  placeholder="Ej: Cofre Principal"
                  placeholderTextColor="#c9a07a"
                  value={newInventory.name}
                  onChangeText={(text) =>
                    setNewInventory({ ...newInventory, name: text })
                  }
                  style={styles.input}
                  mode="flat"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#ffffff"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de slots</Text>
                <TextInput
                  placeholder="27"
                  placeholderTextColor="#c9a07a"
                  value={newInventory.slots.toString()}
                  onChangeText={(text) =>
                    setNewInventory({ ...newInventory, slots: text })
                  }
                  keyboardType="numeric"
                  style={styles.input}
                  mode="flat"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#ffffff"
                />
              </View>
              <Button
                mode="contained"
                onPress={addInventory}
                buttonColor="#4CAF50"
                textColor="#ffffff"
                style={styles.submitButton}
                labelStyle={styles.submitButtonLabel}
                icon="check"
              >
                Crear Inventario
              </Button>
            </Card.Content>
          </Card>
        )}

        {inventories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No hay inventarios. ¡Crea uno!</Text>
          </View>
        ) : (
          inventories.map((inventory, index) => (
            <Card key={index} style={styles.inventoryCard}>
              <Card.Content>
                <View style={styles.inventoryHeader}>
                  <View>
                    <Text variant="titleMedium" style={styles.inventoryName}>
                      {inventory.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.inventorySlots}>
                      {inventory.items.filter(i => i !== null).length} / {inventory.slots} slots
                    </Text>
                  </View>
                </View>

                <RenderInventoryGrid inventory={inventory} />

                <Card.Actions style={styles.cardActions}>
                  <Button
                    onPress={() => showInventoryDetails(inventory)}
                    mode="contained"
                    buttonColor="#FBC02D"
                    textColor="#111111"
                    style={styles.actionDetailsButton}
                    labelStyle={styles.actionButtonLabel}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    onPress={() => {
                      Alert.alert(
                        'Eliminar Inventario',
                        `¿Estás seguro de que quieres eliminar "${inventory.name}"? Esta acción no se puede deshacer.`,
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { 
                            text: 'Eliminar', 
                            style: 'destructive',
                            onPress: () => deleteInventory(inventory.id)
                          }
                        ]
                      );
                    }}
                    mode="contained"
                    buttonColor="#C62828"
                    textColor="#FFFFFF"
                    style={styles.actionDeleteButton}
                    labelStyle={styles.actionButtonLabel}
                    icon="delete"
                  >
                    Eliminar
                  </Button>
                </Card.Actions>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialogSurface}>
          <Dialog.Title style={styles.dialogTitle}>Detalles del Inventario</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            {selectedInventory && (
              <View>
                <Text variant="titleMedium" style={styles.detailTitle}>
                  {selectedInventory.name}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Total de slots:</Text>{' '}
                  {selectedInventory.slots}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Slots ocupados:</Text>{' '}
                  {selectedInventory.items.filter(i => i !== null).length}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Slots libres:</Text>{' '}
                  {selectedInventory.slots - selectedInventory.items.filter(i => i !== null).length}
                </Text>

                {selectedInventory.items.some(i => i !== null) && (
                  <View style={styles.itemsListContainer}>
                    <Text style={styles.itemsListTitle}>Items:</Text>
                    {selectedInventory.items.map((item, idx) => item && (
                      <List.Item
                        key={idx}
                        title={item.name}
                        description={`ID: ${item.id || 'N/A'}`}
                        left={(props) => (
                          <Text {...props} style={styles.itemBullet}>
                            •
                          </Text>
                        )}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              onPress={hideDialog}
              mode="contained"
              buttonColor="#FBC02D"
              textColor="#111111"
              style={styles.dialogActionButton}
              labelStyle={styles.actionButtonLabel}
            >
              Cerrar
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showItemSelector} onDismiss={() => setShowItemSelector(false)} style={styles.dialogSurface}>
          <Dialog.Title style={styles.dialogTitle}>Seleccionar Item</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <Searchbar
              placeholder="Buscar item..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbarDialog}
              inputStyle={styles.searchbarDialogInput}
              iconColor="#F5DEC8"
              placeholderTextColor="#F5DEC8"
            />
            <FlatList
              data={filteredItems}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dialogListItemTouch}
                  onPress={() => {
                    if (selectedInventory && selectedSlot !== null) {
                      addItemToSlot(selectedInventory.id, selectedSlot, item);
                    }
                  }}
                >
                  <List.Item
                    title={item.name}
                    description={item.displayName}
                    titleStyle={styles.dialogListTitle}
                    descriptionStyle={styles.dialogListDescription}
                    style={styles.dialogListItem}
                    left={(props) => <List.Icon {...props} icon="cube" />}
                  />
                </TouchableOpacity>
              )}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              style={styles.itemsList}
            />
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              onPress={() => setShowItemSelector(false)}
              mode="contained"
              buttonColor="#FBC02D"
              textColor="#111111"
              style={styles.dialogActionButton}
              labelStyle={styles.actionButtonLabel}
            >
              Cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  scrollContent: {
    padding: 10,
    paddingBottom: 20,
  },
  addButton: {
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#111111',
    borderRadius: 0,
  },
  addButtonLabel: {
    fontWeight: '900',
    letterSpacing: 0.5,
    fontSize: 14,
  },
  formCard: {
    marginBottom: 15,
    elevation: 0,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#111111',
    backgroundColor: '#5a2800',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 0,
  },
  formTitleRow: {
    borderBottomWidth: 3,
    borderBottomColor: '#3a1800',
    marginBottom: 16,
    paddingBottom: 10,
  },
  formTitle: {
    fontWeight: '900',
    color: '#FFE4C7',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#FFE4C7',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#8B4513',
    borderWidth: 3,
    borderColor: '#111111',
    borderRadius: 0,
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
    borderWidth: 3,
    borderColor: '#111111',
    borderRadius: 0,
  },
  submitButtonLabel: {
    fontWeight: '900',
    letterSpacing: 0.5,
    fontSize: 14,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  inventoryCard: {
    marginBottom: 15,
    elevation: 0,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#111111',
    backgroundColor: '#6f3208',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  inventoryHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inventoryName: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#ffffff',
  },
  inventorySlots: {
    color: '#f3e2d2',
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  inventorySlot: {
    width: '20%',
    aspectRatio: 1,
    padding: 2,
  },
  filledSlot: {
    flex: 1,
    backgroundColor: '#b8743f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#111111',
  },
  emptySlot: {
    flex: 1,
    backgroundColor: '#d9a977',
    borderWidth: 1,
    borderColor: '#111111',
  },
  slotIcon: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  slotItemText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardActions: {
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  actionDetailsButton: {
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
    minWidth: 150,
  },
  actionDeleteButton: {
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
    minWidth: 120,
  },
  actionButtonLabel: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailText: {
    marginVertical: 5,
    color: '#F5DEC8',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#FFE4C7',
  },
  itemsListContainer: {
    marginTop: 15,
  },
  itemsListTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F5DEC8',
  },
  itemBullet: {
    marginLeft: 0,
    color: '#F5DEC8',
  },
  searchbarDialog: {
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
    backgroundColor: '#9a5a2a',
  },
  searchbarDialogInput: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  itemsList: {
    maxHeight: 300,
    backgroundColor: '#7d3b0f',
  },
  dialogSurface: {
    backgroundColor: '#6f3208',
    borderWidth: 4,
    borderColor: '#111111',
    borderRadius: 0,
  },
  dialogTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  dialogContent: {
    backgroundColor: '#7d3b0f',
    borderWidth: 2,
    borderColor: '#5c2e0d',
    paddingTop: 12,
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  dialogActionButton: {
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
    minWidth: 140,
  },
  dialogListItemTouch: {
    borderBottomWidth: 1,
    borderBottomColor: '#5c2e0d',
  },
  dialogListItem: {
    paddingVertical: 2,
  },
  dialogListTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dialogListDescription: {
    color: '#F5DEC8',
  },
});
