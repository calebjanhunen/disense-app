import { User } from '@/interfaces/User';
import { ResultSet } from 'expo-sqlite';
import { db } from './db';

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

export async function getAllUsersForExporting(): Promise<
  { [column: string]: unknown }[] | null
> {
  try {
    let users: ResultSet = {} as ResultSet;
    await db.transactionAsync(async tx => {
      users = await tx.executeSqlAsync(
        'SELECT id, created_at, weight, height, shoe_size from users'
      );
    });
    return users.rows.length === 0 ? null : users.rows;
  } catch (e) {
    console.warn(e);
    throw e;
  }
}
