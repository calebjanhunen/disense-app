import React, { useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import { StopwatchProvider } from './src/context/stopwatch';
import { TestInfoProvider } from './src/context/test-info-context';
import { createTables } from './src/db/db';
import AppNavigation from './src/navigation/app-navigation';
import { theme } from './src/theme/theme';
import { BLEContextProvider } from './src/context/ble-context';
import { SensorContextProvider } from './src/context/sensor-context';

export default function App(): React.ReactElement | null {
  const [fontLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
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
    <SensorContextProvider>
      <BLEContextProvider>
        <StopwatchProvider>
          <TestInfoProvider>
            <PaperProvider>
              <ThemeProvider theme={theme}>
                <SafeAreaView style={styles.AndroidSafeArea}>
                  <AppNavigation />
                  {/* <StatusBar barStyle="light-content" /> */}
                </SafeAreaView>
              </ThemeProvider>
            </PaperProvider>
          </TestInfoProvider>
        </StopwatchProvider>
      </BLEContextProvider>
    </SensorContextProvider>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
