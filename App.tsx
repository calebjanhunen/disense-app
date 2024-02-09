import React from 'react';
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
import AppNavigation from './src/navigation/app-navigation';
import { theme } from './src/theme/theme';

export default function App(): React.ReactElement | null {
  const [fontLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontLoaded) {
    return null;
  }
  return (
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
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
