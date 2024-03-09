import { Location } from '@/interfaces/Location';
import { LocationDB } from './DBInterfaces';
import { db } from './db';

export async function insertLocation(
  location: Location,
  user: number
): Promise<number> {
  try {
    let insertedId: number | undefined = undefined;
    await db.transactionAsync(async tx => {
      const result = await tx.executeSqlAsync(
        'INSERT INTO location (location, user) VALUES (?, ?)',
        [location, user]
      );
      insertedId = result.insertId;
    });
    if (!insertedId) {
      throw new Error('Location not inserted');
    }
    return insertedId;
  } catch (e) {
    console.warn('Could not save location: ', e); //TODO: Log to error logger
    throw e;
  }
}

export async function updateLocationById(
  id: number,
  user: number
): Promise<void> {
  try {
    const result = await getLocationById(id, user);
    if (!result) {
      throw new Error(`No location with for user: ${user} with id: ${id}`);
    }

    await db.transactionAsync(async tx => {
      await tx.executeSqlAsync(
        `UPDATE location SET
            time_ended = CURRENT_TIMESTAMP
        WHERE
            id=? AND user=?`,
        [id, user]
      );
    });
  } catch (e) {
    console.warn('Could not update location: ', e); //TODO: Log to error logger
    throw e;
  }
}

export async function getLocationById(
  id: number,
  user: number
): Promise<LocationDB | null> {
  try {
    let location: LocationDB | null = null;
    await db.transactionAsync(async tx => {
      const result = await tx.executeSqlAsync(
        'SELECT * FROM location WHERE id=? AND user=?',
        [id, user]
      );
      if (result.rows.length === 0) return;

      location = {
        id: result.rows[0]['id'],
        location: result.rows[0]['location'],
        timeStarted: result.rows[0]['time_started'],
        timeEnded: result.rows[0]['time_ended'],
        user: result.rows[0]['user'],
      };
    });
    if (location) return location;
    else return null;
  } catch (e) {
    console.warn('Could not get location: ', e); //TODO: Log to error logger
    throw e;
  }
}

export async function deleteLocationsForUser(user: number): Promise<void> {
  try {
    await db.transactionAsync(async tx => {
      await tx.executeSqlAsync('DELETE FROM location WHERE user=?', [user]);
    });
  } catch (e) {
    console.warn(e);
    throw e;
  }
}
