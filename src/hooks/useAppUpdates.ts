// import 'dotenv/config';
import { handleError } from '@/utils/error-handler';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export function useAppUpdates() {
  useEffect(() => {
    checkForUpdates();
  }, []);

  async function checkForUpdates() {
    if (Constants.expoConfig?.name === 'Disense (Dev)') {
      return;
    }

    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // Inform the user that the update has been downloaded and will be applied on the next app restart
        Alert.alert(
          'Update Available',
          'A new update was downloaded and will be applied when you restart the app.',
          [
            { text: 'Restart Now', onPress: () => Updates.reloadAsync() },
            { text: 'Later' },
          ]
        );
      }
    } catch (e) {
      handleError('Could not update the app', e);
    }
  }
}
