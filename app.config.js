/* eslint-disable no-undef */
import 'dotenv/config';
const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  name: IS_DEV ? 'Disense (Dev)' : 'Disense',
  slug: 'disense-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: IS_DEV ? 'com.disense.disense.dev' : 'com.disense.disense',
    permissions: [
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.BLUETOOTH_CONNECT',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      '@config-plugins/react-native-ble-plx',
      {
        isBackgroundEnabled: true,
        modes: ['peripheral', 'central'],
        bluetoothAlwaysPermission:
          'Allow $(PRODUCT_NAME) to connect to bluetooth devices',
      },
    ],
  ],
  sdkVersion: '49.0.0',
  entryPoint: '.vscode\\exponentIndex.js',
  extra: {
    eas: {
      projectId: '4c916a71-e601-4a36-b80a-46bbc6967e78',
    },
  },
  runtimeVersion: '1.0.0',
  updates: {
    url: 'https://u.expo.dev/4c916a71-e601-4a36-b80a-46bbc6967e78',
  },
};
