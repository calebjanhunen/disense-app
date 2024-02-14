import { SQLTransactionAsync } from 'expo-sqlite';
import { FSR, Thermistor } from '../interfaces/Sensor';
import { db } from './db';

export async function bulkInsertIntoThermistorTable(
  sensors: Thermistor[],
  user: number
) {
  try {
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      for (const sensor of sensors) {
        const { id, temp } = sensor;
        await tx.executeSqlAsync(
          'INSERT INTO thermistor_data (sensor_id, temperature, user) VALUES (?, ?, ?)',
          [id, temp, user]
        );
        console.log('Inserted thermistor with id: ', id);
      }
    });
    console.log('Thermistor transaction success');
  } catch (e) {
    console.log('transaction error: ', e);
    throw e;
  }
  // console.log('Inserted into thermistor_data', result);
}

export async function bulkInsertIntoFSRTable(sensors: FSR[], user: number) {
  try {
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      for (const sensor of sensors) {
        const { id, force } = sensor;
        await tx.executeSqlAsync(
          'INSERT INTO fsr_data (sensor_id, force, user) VALUES (?, ?, ?)',
          [id, force, user]
        );
        console.log('Inserted fsr with id: ', id);
      }
    });
    console.log('FSR transaction success');
  } catch (e) {
    console.log('transaction error: ', e);
    throw e;
  }
  // console.log('Inserted into thermistor_data', result);
}
