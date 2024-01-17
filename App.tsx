import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

export default function App() {
  useEffect(() => {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('Bluetooth enabled');
      })
      .catch(e => {
        console.log('error: ', e);
      });
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text>Connect</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});
