import { db } from './db';

export async function deleteSpo2DataForUser(user: number): Promise<void> {
  try {
    await db.transactionAsync(async tx => {
      await tx.executeSqlAsync('DELETE FROM spo2_data WHERE user=?', [user]);
    });
  } catch (e) {
    console.warn(e);
    throw e;
  }
}
