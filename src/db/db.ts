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

    const thermistorTableResult = await db.execAsync(
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
    console.log('THERMISTOR table created:', thermistorTableResult);

    const fsrTableResult = await db.execAsync(
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
    console.log('FSR table created:', fsrTableResult);

    const spo2TableResult = await db.execAsync(
      [
        {
          sql: `CREATE TABLE IF NOT EXISTS spo2_data (
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
    console.log('SPO2 table created:', spo2TableResult);
  } catch (e) {
    console.log('ERror creating table: ', e);
  }
}
