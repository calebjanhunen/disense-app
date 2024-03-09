import { db } from './db';

export async function deleteFsrDataForUser(user: number): Promise<void> {
  try {
    await db.transactionAsync(async tx => {
      await tx.executeSqlAsync('DELETE FROM fsr_data WHERE user=?', [user]);
    });
  } catch (e) {
    console.warn(e);
    throw e;
  }
}
