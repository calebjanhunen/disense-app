import { Alert } from 'react-native';

export function handleError(message: string, e: unknown): void {
  if (e instanceof Error) {
    Alert.alert(message, e.message);
  } else {
    Alert.alert(message, 'Unknown error');
  }
}
