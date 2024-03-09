import { User } from '@/interfaces/User';
import { ResultSet } from 'expo-sqlite';
import { deleteActivityStatesForUser } from './activity-state-repository';
import { db } from './db';
import { deleteFsrDataForUser } from './fsr-repository';
import { deleteLocationsForUser } from './location-repository';
import { deleteSpo2DataForUser } from './spo2-repository';
import { deleteThermistorDataForUser } from './thermistor-repository';

export async function insertUser(user: User): Promise<number | undefined> {
  try {
    if (!user.height || !user.weight || !user.shoeSize)
      throw new Error('Missing values');
    let result: ResultSet = {} as ResultSet;
    await db.transactionAsync(async tx => {
      result = await tx.executeSqlAsync(
        'INSERT INTO users (weight, height, shoe_size) VALUES (?, ?, ?)',
        [user.weight, user.height, user.shoeSize]
      );
    });
    console.log('inserted user: ', result);
    return result.insertId;
  } catch (e) {
    console.warn(e);
    throw e;
  }
}

export async function getById(userId: number): Promise<User | null> {
  try {
    let user: User | null = null;
    await db.transactionAsync(async tx => {
      const result = await tx.executeSqlAsync(
        'SELECT * from users WHERE id=?',
        [userId]
      );
      if (result.rows.length > 0) {
        user = {
          id: result.rows[0]['id'],
          height: result.rows[0]['height'],
          weight: result.rows[0]['weight'],
          shoeSize: result.rows[0]['shoe_size'],
        };
      }
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (e) {
    console.warn(e);
    throw e;
  }
}

export async function getAllUsersFromDb(): Promise<User[]> {
  try {
    const users: User[] = [];
    await db.transactionAsync(async tx => {
      const result = await tx.executeSqlAsync('SELECT * from users');
      if (result.rows.length > 0) {
        for (const row of result.rows) {
          users.push({
            id: row['id'],
            height: row['height'],
            weight: row['weight'],
            shoeSize: row['shoe_size'],
          });
        }
      }
    });
    return users;
  } catch (e) {
    console.warn(e);
    throw e;
  }
}

export async function deleteAllDataForUser(userId: number): Promise<void> {
  try {
    const user = await getById(userId);
    if (!user) throw new Error('User does not exist');

    await db.transactionAsync(async tx => {
      await deleteThermistorDataForUser(userId);
      await deleteFsrDataForUser(userId);
      await deleteSpo2DataForUser(userId);
      await deleteActivityStatesForUser(userId);
      await deleteLocationsForUser(userId);
    });
  } catch (e) {
    console.warn(e);
    throw e;
  }
}
