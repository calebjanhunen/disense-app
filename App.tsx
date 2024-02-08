import React, { useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ThemeProvider } from 'styled-components';
import { connectToDB } from './src/db/db';
import AppNavigation from './src/navigation/app-navigation';
import { theme } from './src/theme/theme';

export default function App(): React.ReactElement | null {
  const [fontLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  // useEffect(() => {
  //   initDB();
  // }, []);

  if (!fontLoaded) {
    return null;
  }

  async function initDB() {
    const db = await connectToDB('./src/db/database.db');
    console.log(db);
  }
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.AndroidSafeArea}>
        <AppNavigation />
        {/* <StatusBar barStyle="light-content" /> */}
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
