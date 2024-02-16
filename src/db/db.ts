import { openDatabase } from 'expo-sqlite';

export const db = openDatabase('disense.db');

export async function createTables() {
  try {
    const userTableResult = await db.execAsync(
      [
        {
          sql: `CREATE TABLE IF NOT EXISTS users (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`,
          args: [],
        },
      ],
      false
    );
    console.log('User table created:', userTableResult);

    await db.execAsync(
      [
        {
          sql: `CREATE TABLE IF NOT EXISTS thermistor_data (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  sensor_id INTEGER,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  temperature INTEGER,
                  user INTEGER,
                  FOREIGN KEY (user) REFERENCES users(id)
                );`,
          args: [],
        },
      ],
      false
    );

    await db.execAsync(
      [
        {
          sql: `CREATE TABLE IF NOT EXISTS fsr_data (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  sensor_id INTEGER,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                  force INTEGER,
                  user INTEGER,
                  FOREIGN KEY (user) REFERENCES users(id)
                );`,
          args: [],
        },
      ],
      false
    );

    await db.execAsync(
      [
        {
          sql: `CREATE TABLE IF NOT EXISTS spo2_data (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  sensor_id INTEGER,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                  heart_rate INTEGER,
                  blood_oxygen INTEGER,
                  user INTEGER,
                  FOREIGN KEY (user) REFERENCES users(id)
                );`,
          args: [],
        },
      ],
      false
    );
  } catch (e) {
    console.log('ERror creating table: ', e);
  }
}
