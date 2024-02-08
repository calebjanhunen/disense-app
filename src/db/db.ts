import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { openDatabase } from 'expo-sqlite';

export async function connectToDB(pathToDatabaseFile: string) {
  // if (
  //     !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite'))
  //     .exists
  // ) {
  //     await FileSystem.makeDirectoryAsync(
  //     FileSystem.documentDirectory + 'SQLite'
  //     );
  // }
  // await FileSystem.downloadAsync(
  //     // eslint-disable-next-line @typescript-eslint/no-var-requires
  //     Asset.fromModule(require(pathToDatabaseFile)).uri,
  //     FileSystem.documentDirectory + 'SQLite/myDatabaseName.db'
  // );
  return openDatabase('disense.db');
}
