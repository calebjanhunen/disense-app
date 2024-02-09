import { SQLiteDatabase } from 'expo-sqlite';

const tableName = 'thermistor_data';

export async function insertIntoThermistorTable(
  db: SQLiteDatabase,
  temperature: number,
  user: number
) {
  try {
    const result = await db.execAsync(
      [
        {
          sql: 'INSERT INTO ? (temperature, user) VALUES (?, ?)',
          args: [tableName, temperature, user],
        },
      ],
      false
    );
    console.log('Inserted into thermistor_data', result);
  } catch (e) {
    console.log('Error inserting into thermsitor_data: ', e);
  }
}
