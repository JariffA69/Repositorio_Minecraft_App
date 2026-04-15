import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useRenderItems } from '../../Context/RenderContext';

export default function ItemDetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const { addItemToRender } = useRenderItems();

  const handleAddToRender = () => {
    addItemToRender(item);
    navigation.navigate('MinecraftRender');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            {item.name}
          </Text>

          <View style={styles.infoContainer}>
            {item.id && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>ID:</Text>
                <Text variant="bodyLarge" style={styles.valueText}>{item.id}</Text>
              </View>
            )}

            {item.displayName && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>Nombre:</Text>
                <Text variant="bodyLarge" style={styles.valueText}>{item.displayName}</Text>
              </View>
            )}

            {item.maxStackSize && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>Tamaño Máximo de Stack:</Text>
                <Text variant="bodyLarge" style={styles.valueText}>{item.maxStackSize}</Text>
              </View>
            )}

            {item.type && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>Tipo:</Text>
                <Text variant="bodyLarge" style={styles.valueText}>{item.type}</Text>
              </View>
            )}

            {item.version && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>Versión:</Text>
                <Text variant="bodyLarge" style={styles.valueText}>{item.version}</Text>
              </View>
            )}

            {item.description && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>Descripción:</Text>
                <Text variant="bodyMedium" style={styles.valueText}>{item.description}</Text>
              </View>
            )}

            {item.category && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>Categoría:</Text>
                <Text variant="bodyLarge" style={styles.valueText}>{item.category}</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={handleAddToRender}
              buttonColor="#4CAF50"
              textColor="#ffffff"
              style={[styles.button, styles.primaryButton]}
              labelStyle={styles.buttonLabel}
            >
              Agregar a Render
            </Button>
            <Button 
              mode="contained" 
              onPress={() => navigation.goBack()}
              buttonColor="#FBC02D"
              textColor="#111111"
              style={[styles.button, styles.secondaryButton]}
              labelStyle={styles.buttonLabel}
            >
              Volver
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
  },
  card: {
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#0b0b0b',
    borderRadius: 0,
    backgroundColor: '#7a390d',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#5c2e0d',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffe5cc',
  },
  valueText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginVertical: 5,
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 0,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#FBC02D',
  },
  buttonLabel: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
