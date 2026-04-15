import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, ActivityIndicator, Chip } from 'react-native-paper';
import { getItemGifSource, getItemIconUrl } from '../../utils/minecraftApi';
import { fromByteArray } from 'base64-js';

export default function RenderDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const isBlock = item?.type === 'block';
  const [imageError, setImageError] = useState(false);
  const [loadingGif, setLoadingGif] = useState(true);
  const [gifDataUri, setGifDataUri] = useState(null);

  const gifSource = useMemo(
    () => {
      const itemKey = item.itemId || item.name;
      const isBlock = item?.type === 'block';

      return getItemGifSource(itemKey, {
        frames: isBlock ? 24 : 16,
        speed: isBlock ? 60 : 70,
        scale: isBlock ? 2 : 1,
        glint: isBlock ? false : true,
      });
    },
    [item.itemId, item.name, item.type]
  );

  useEffect(() => {
    let isMounted = true;

    const loadGif = async () => {
      try {
        if (isBlock) {
          if (isMounted) {
            setLoadingGif(false);
            setImageError(false);
            setGifDataUri(null);
          }
          return;
        }

        setLoadingGif(true);
        setImageError(false);
        setGifDataUri(null);

        if (!gifSource) {
          throw new Error('GIF source inválido');
        }

        const response = await fetch(gifSource.uri, {
          method: gifSource.method,
          headers: gifSource.headers,
          body: gifSource.body,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64 = fromByteArray(new Uint8Array(arrayBuffer));
        const dataUri = `data:image/gif;base64,${base64}`;

        if (isMounted) {
          setGifDataUri(dataUri);
          setLoadingGif(false);
        }
      } catch (error) {
        console.log('Error loading GIF:', error?.message || error);
        if (isMounted) {
          setImageError(true);
          setLoadingGif(false);
        }
      }
    };

    loadGif();

    return () => {
      isMounted = false;
    };
  }, [gifSource, isBlock]);

  const handleImageError = () => {
    console.log('Error loading GIF for:', item.name);
    setLoadingGif(false);
    setImageError(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {item.name}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {item.displayName}
        </Text>
        <Chip compact style={styles.modeChip} textStyle={styles.modeChipText}>
          {isBlock ? 'Vista 3D estática' : 'Vista 3D animada'}
        </Chip>
      </View>

      <View style={styles.gifContainer}>
        {!isBlock && !imageError && loadingGif && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator animating size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Cargando render 3D...</Text>
          </View>
        )}

        {isBlock || imageError || !gifDataUri ? (
          <Image
            source={{ uri: getItemIconUrl(item.itemId || item.name) }}
            style={styles.gifImage}
          />
        ) : (
          <Image
            key={item.itemId || item.name}
            source={{ uri: gifDataUri }}
            style={styles.gifImage}
            onError={() => handleImageError()}
          />
        )}

        {!isBlock && imageError && (
          <Text variant="bodySmall" style={styles.fallbackText}>
            Se mostró la vista estática porque este render 3D no respondió.
          </Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.infoLabel}>ID:</Text>
          <Text variant="bodyMedium" style={styles.infoValue}>{item.itemId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.infoLabel}>Tipo:</Text>
          <Text variant="bodyMedium" style={styles.infoValue}>{item.type}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.infoLabel}>Categoría:</Text>
          <Text variant="bodyMedium" style={styles.infoValue}>{item.category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.infoLabel}>Stack máximo:</Text>
          <Text variant="bodyMedium" style={styles.infoValue}>{item.maxStackSize}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Volver
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: '#6f3208',
    borderWidth: 4,
    borderColor: '#0b0b0b',
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    color: '#ffe4c7',
    marginTop: 5,
    marginBottom: 10,
  },
  modeChip: {
    backgroundColor: '#4CAF50',
  },
  modeChipText: {
    color: '#fff',
    fontWeight: '700',
  },
  gifContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7d3b0f',
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#0b0b0b',
    marginVertical: 20,
    padding: 10,
    overflow: 'hidden',
  },
  gifImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15,8,4,0.38)',
    zIndex: 2,
  },
  loadingText: {
    color: '#fff2e4',
    marginTop: 12,
    fontWeight: '700',
  },
  fallbackText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    textAlign: 'center',
    color: '#cfcfcf',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  infoContainer: {
    backgroundColor: '#9a5a2a',
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#0b0b0b',
    padding: 15,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#5f2f10',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#ffe4c7',
  },
  infoValue: {
    color: '#ffffff',
    fontWeight: '700',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 8,
  },
});
