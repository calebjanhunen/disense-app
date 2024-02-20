import { ResultSet, SQLTransactionAsync } from 'expo-sqlite';
import { FSR, SPO2Sensor, Thermistor } from '../interfaces/Sensor';
import { db } from './db';
import { SensorDB } from './DBInterfaces';
import { handleError } from '@/utils/error-handler';

export type TableName = 'thermistor' | 'fsr' | 'spo2';

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

export async function getSensorDataForUser(
  tableName: TableName,
  user: number
): Promise<{ [column: string]: unknown }[] | null> {
  if (tableName === 'thermistor') {
    return await getThermistorDataForUser(user);
  } else if (tableName === 'fsr') {
    return await getFSRDataForUser(user);
  } else if (tableName === 'spo2') {
    return await getSpo2DataForUser(user);
  }
  return null;
}

export async function getThermistorDataForUser(
  user: number
): Promise<{ [column: string]: unknown }[] | null> {
  try {
    let data: ResultSet = {} as ResultSet;
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      data = await tx.executeSqlAsync(
        'SELECT * from thermistor_data WHERE user=?',
        [user]
      );
    });
    return data.rows.length === 0 ? null : data.rows;
  } catch (e) {
    console.log('Error getting from thermistor table: ', e);
  }
  return null;
}

export async function getThermistorDataForUserV2(
  user: number,
  orderBy?: string,
  direction?: 'ASC' | 'DESC',
  limit?: number
): Promise<SensorDB[]> {
  const dir = direction || 'ASC';
  const order = orderBy || 'id';
  limit = limit || 10;
  try {
    const thermisorData: SensorDB[] = [];
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      const data = await tx.executeSqlAsync(
        `SELECT * from thermistor_data WHERE user=? ORDER BY  ${order} ${dir} LIMIT ${limit}`,
        [user]
      );

      for (const row of data.rows) {
        thermisorData.push({
          id: row['id'],
          sensorId: row['sensor_id'],
          createdAt: row['created_at'],
          value: row['temperature'],
        });
      }
    });

    return thermisorData;
  } catch (e) {
    console.log('Error getting from thermistor table: ', e);
    handleError('Could not get thermistor data', e);
    return [];
  }
}

export async function getFSRDataForUser(
  user: number
): Promise<{ [column: string]: unknown }[] | null> {
  try {
    let data: ResultSet = {} as ResultSet;
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      data = await tx.executeSqlAsync('SELECT * from fsr_data WHERE user=?', [
        user,
      ]);
    });
    return data.rows.length === 0 ? null : data.rows;
  } catch (e) {
    console.log('Error getting from fsr table: ', e);
  }
  return null;
}

export async function getFsrDataForUserV2(
  user: number,
  orderBy?: string,
  direction?: 'ASC' | 'DESC',
  limit?: number
): Promise<SensorDB[]> {
  const dir = direction || 'ASC';
  const order = orderBy || 'id';
  limit = limit || 10;
  try {
    const fsrData: SensorDB[] = [];
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      const data = await tx.executeSqlAsync(
        `SELECT * from fsr_data WHERE user=? ORDER BY  ${order} ${dir} LIMIT ${limit}`,
        [user]
      );

      for (const row of data.rows) {
        fsrData.push({
          id: row['id'],
          sensorId: row['sensor_id'],
          createdAt: row['created_at'],
          value: row['force'],
        });
      }
    });

    return fsrData;
  } catch (e) {
    console.log('Error getting from fsr table: ', e);
    handleError('Could not get fsr data', e);
    return [];
  }
}

export async function getSpo2DataForUser(
  user: number
): Promise<{ [column: string]: unknown }[] | null> {
  try {
    let data: ResultSet = {} as ResultSet;
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      data = await tx.executeSqlAsync('SELECT * from spo2_data WHERE user=?', [
        user,
      ]);
    });
    return data.rows.length === 0 ? null : data.rows;
  } catch (e) {
    console.log('Error getting from spo2 table: ', e);
  }
  return null;
}

export async function getSpo2DataForUserV2(
  user: number,
  orderBy?: string,
  direction?: 'ASC' | 'DESC',
  limit?: number
): Promise<SensorDB[]> {
  const order = orderBy || 'id';
  const dir = direction || 'ASC';
  limit = limit || 10;
  console.log(limit);
  try {
    const spo2Data: SensorDB[] = [];
    await db.transactionAsync(async (tx: SQLTransactionAsync) => {
      const data = await tx.executeSqlAsync(
        `SELECT * from spo2_data WHERE user=? ORDER BY ${order} ${dir} LIMIT ${limit}`,
        [user]
      );

      for (const row of data.rows) {
        spo2Data.push({
          id: row['id'],
          sensorId: row['sensor_id'],
          createdAt: row['created_at'],
          value: row['blood_oxygen'],
        });
      }
    });

    return spo2Data;
  } catch (e) {
    console.log('Error getting from spo2 table: ', e);
    handleError('Could not get spo2 data', e);
    return [];
  }
}
