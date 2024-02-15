import { SQLTransactionAsync } from 'expo-sqlite';
import { FSR, SPO2Sensor, Thermistor } from '../interfaces/Sensor';
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

export async function bulkInsertIntoSPO2Table(
  sensors: SPO2Sensor[],
  user: number
) {
  try {
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      for (const sensor of sensors) {
        const { id, heartRate, bloodOxygen } = sensor;
        await tx.executeSqlAsync(
          'INSERT INTO spo2_data (sensor_id, heart_rate, blood_oxygen, user) VALUES (?, ?, ?, ?)',
          [id, heartRate, bloodOxygen, user]
        );
        console.log('Inserted spo2 with id: ', id);
      }
    });
    console.log('SPO2 transaction success');
  } catch (e) {
    console.log('transaction error: ', e);
    throw e;
  }
}
