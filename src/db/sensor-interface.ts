import { handleError } from '@/utils/error-handler';
import { ResultSet, SQLTransactionAsync } from 'expo-sqlite';
import { FSR, SPO2Sensor, Thermistor } from '../interfaces/Sensor';
import { SensorDB } from './DBInterfaces';
import { db } from './db';

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
      }
    });
  } catch (e) {
    handleError('Could not save thermistor data', e);
    throw e;
  }
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
      }
    });
  } catch (e) {
    handleError('Could not save fsr data', e);
    throw e;
  }
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
      }
    });
  } catch (e) {
    handleError('Could not save spo2 data', e);
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
        `SELECT td.*, state.activity_state, l.location
        FROM thermistor_data td
        LEFT JOIN activity_state state
        ON td.created_at BETWEEN state.time_started AND state.time_ended
        AND td.user = state.user
        LEFT JOIN location l
        ON td.created_at BETWEEN l.time_started AND l.time_ended
        AND td.user = l.user
        WHERE td.user=?`,
        [user]
      );
    });
    return data.rows.length === 0 ? null : data.rows;
  } catch (e) {
    handleError('Error getting thermistor data', e);
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
      data = await tx.executeSqlAsync(
        `SELECT fsr.*, state.activity_state, l.location
        FROM fsr_data fsr
        LEFT JOIN activity_state state
        ON fsr.created_at BETWEEN state.time_started AND state.time_ended
        AND fsr.user = state.user
        LEFT JOIN location l
        ON fsr.created_at BETWEEN l.time_started AND l.time_ended
        AND fsr.user = l.user
        WHERE fsr.user=?`,
        [user]
      );
    });
    return data.rows.length === 0 ? null : data.rows;
  } catch (e) {
    handleError('Error getting fsr data', e);
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
      data = await tx.executeSqlAsync(
        `SELECT spo2.*, state.activity_state, l.location
        FROM spo2_data spo2
        LEFT JOIN activity_state state
        ON spo2.created_at BETWEEN state.time_started AND state.time_ended
        AND spo2.user = state.user
        LEFT JOIN location l
        ON spo2.created_at BETWEEN l.time_started AND l.time_ended
        AND spo2.user = l.user
        WHERE spo2.user=?`,
        [user]
      );
    });
    return data.rows.length === 0 ? null : data.rows;
  } catch (e) {
    handleError('Error getting spo2 data', e);
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
    handleError('Could not get spo2 data', e);
    return [];
  }
}
