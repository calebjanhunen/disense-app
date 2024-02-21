import { ActivityState } from '@/interfaces/ActivityState';
import { db } from './db';
import { ActivityStateDB } from './DBInterfaces';
import { ResultSet } from 'expo-sqlite';

export async function insertActivityState(
  activty: ActivityState,
  user: number
): Promise<number> {
  try {
    let insertedId: number | undefined = undefined;
    await db.transactionAsync(async tx => {
      const result = await tx.executeSqlAsync(
        'INSERT INTO activity_state (activity_state, user) VALUES (?, ?)',
        [activty, user]
      );
      insertedId = result.insertId;
    });
    if (!insertedId) {
      throw new Error('Activity not inserted');
    }
    return insertedId;
  } catch (e) {
    console.warn('Could not insert activity', e);
    throw e;
  }
}

export async function updateActivityStateById(
  id: number,
  user: number
): Promise<void> {
  try {
    const result = await getActivityStateById(id, user);
    if (!result) {
      throw new Error(
        `No activity state with for user: ${user} with id: ${id}`
      );
    }

    await db.transactionAsync(async tx => {
      await tx.executeSqlAsync(
        `UPDATE activity_state SET
            time_ended = CURRENT_TIMESTAMP
        WHERE
            id=? AND user=?`,
        [id, user]
      );
    });
  } catch (e) {
    console.warn('Could not update activity state: ', e);
    throw e;
  }
}

export async function getActivityStateById(
  id: number,
  user: number
): Promise<ActivityStateDB | null> {
  try {
    let activityState: ActivityStateDB | null = null;
    await db.transactionAsync(async tx => {
      const result = await tx.executeSqlAsync(
        'SELECT * FROM activity_state WHERE id=? AND user=?',
        [id, user]
      );
      if (result.rows.length === 0) return;

      activityState = {
        id: result.rows[0]['id'],
        activityState: result.rows[0]['activity_state'],
        timeStarted: result.rows[0]['time_started'],
        timeEnded: result.rows[0]['time_ended'],
        user: result.rows[0]['user'],
      };
    });
    if (activityState) return activityState;
    else return null;
  } catch (e) {
    console.warn('Could not get activity state: ', e);
    throw e;
  }
}

export async function getActivityStatesForUser(
  user: number
): Promise<{ [column: string]: unknown }[] | null> {
  try {
    let result: ResultSet = {} as ResultSet;
    await db.transactionAsync(async tx => {
      result = await tx.executeSqlAsync(
        'SELECT * FROM activity_state WHERE user=?',
        [user]
      );
    });

    return result.rows.length > 0 ? result.rows : null;
  } catch (e) {
    console.warn(`Could not get activity states for user: ${user} - e`);
    throw e;
  }
}
