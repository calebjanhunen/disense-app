import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';

enablePromise(true);

export async function connectToDb(): Promise<SQLiteDatabase | undefined> {
  try {
    const db = await openDatabase({
      name: 'disense-data.db',
      location: 'default',
    });
    console.log('connected to db');
    return db;
  } catch (e) {
    console.log('Error connecting to db: ', e);
  }
}

// export async function createTables(db: SQLiteDatabase) {}
