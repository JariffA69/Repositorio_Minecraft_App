import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import Navigations from './app/screen/Navigations';
import { MinecraftProvider } from './app/Context/MinecraftContext';
import { RenderProvider } from './app/Context/RenderContext';

const theme = {
  ...MD3LightTheme,
  roundness: 0,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#8B4513',
    secondary: '#A65E2E',
    background: '#D9D9D9',
    surface: '#8B4513',
    surfaceVariant: '#A65E2E',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#FFFFFF',
    onBackground: '#111111',
    outline: '#111111',
  },
};

const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: 'transparent',
  },
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
});

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ImageBackground
        source={require('./assets/pastochido.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <MinecraftProvider>
          <RenderProvider>
            <NavigationContainer theme={navigationTheme}>
              <Navigations />
            </NavigationContainer>
          </RenderProvider>
        </MinecraftProvider>
      </ImageBackground>
    </PaperProvider>
  );
}
