import React, { useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { BLEContextProvider } from './context/ble-context';
import { SensorContextProvider } from './context/sensor-context/sensor-context';
import { TestInfoProvider } from './context/test-info-context';
import { createTables } from './db/db';
import { useAppUpdates } from './hooks/useAppUpdates';
import AppNavigation from './navigation/app-navigation';
import { theme } from './theme/theme';

export default function App(): React.ReactElement | null {
  const [fontLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  useAppUpdates();

  useEffect(() => {
    initDB();
  }, []);

  if (!fontLoaded) {
    return null;
  }

  async function initDB() {
    await createTables();
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TestInfoProvider>
        <SensorContextProvider>
          <BLEContextProvider>
            <PaperProvider>
              <ThemeProvider theme={theme}>
                <MenuProvider>
                  <AppNavigation />
                  <StatusBar barStyle='default' />
                </MenuProvider>
              </ThemeProvider>
            </PaperProvider>
          </BLEContextProvider>
        </SensorContextProvider>
      </TestInfoProvider>
    </GestureHandlerRootView>
  );
}
