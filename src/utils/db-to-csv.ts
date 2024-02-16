import { ResultSet } from 'expo-sqlite';

export function convertToCSV(data: ResultSet): string {
  const { rows } = data;
  const headers = Object.keys(rows[0]).join(',') + '\n';
  const rowsCSV = rows.map(row => Object.values(row).join(',')).join('\n');
  return headers + rowsCSV;
}
