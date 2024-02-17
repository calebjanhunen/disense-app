import { Alert } from 'react-native';

export function handleError(e: unknown): void {
  if (e instanceof Error) {
    Alert.alert('Error getting user:', e.message);
  } else {
    Alert.alert('Error getting user:', 'Unknown error');
  }
}
