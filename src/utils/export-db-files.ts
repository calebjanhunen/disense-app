import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { TableName, getSensorDataForUser } from '../db/sensor-interface';
import { getAllUsersForExporting } from '@/db/user-repository';
import { handleError } from './error-handler';

/**
 * The function exports sensor data from a database for a specified user, converts it to CSV format,
 * saves it to a file, and then shares the file.
 * @param {number} user - The user parameter is a number that represents the user for whom the database
 * files are being exported.
 * @returns a Promise that resolves to void.
 */
export async function exportDatabaseFilesForUser(user: number): Promise<void> {
  if (!user) {
    Alert.alert('User not selected', 'A user has not been selected');
    return;
  }

  const sensorDataTableNames: TableName[] = ['thermistor', 'fsr', 'spo2'];
  for (const tableName of sensorDataTableNames) {
    const sensorData = await getSensorData(tableName, user);
    if (!sensorData) continue;
    // console.log(sensorData);

    const csv = convertDBToCSV(sensorData);
    const filePath = await saveCSVToFile(tableName, csv, user);
    if (!filePath) {
      continue;
    }

    await shareFile(filePath, tableName);
  }
}

export async function exportAllUsers(): Promise<void> {
  const users = await getAllUsersForExporting();
  if (!users) {
    handleError('No Users', new Error('There are no saved users to export'));
    return;
  }
  const usersCsv = convertDBToCSV(users);
  const filePath = await saveUserCSVToFile(usersCsv);
  if (!filePath) {
    handleError('Error saving file.', new Error('Error saving users.csv'));
    return;
  }
  await shareFile(filePath, 'users');
}

/**
 * The function `getSensorData` retrieves sensor data from a specified table for a given user and
 * handles potential errors.
 * @param {TableName} tableName - The tableName parameter is the name of the table from which you want
 * to retrieve sensor data.
 * @param {number} user - The `user` parameter is of type `number` and represents the user for whom the
 * sensor data is being retrieved.
 * @returns The function `getSensorData` returns a promise that resolves to an array of objects `{
 * [column: string]: unknown }[]` or `void` (undefined).
 */
async function getSensorData(
  tableName: TableName,
  user: number
): Promise<{ [column: string]: unknown }[] | void> {
  try {
    const sensorData = await getSensorDataForUser(tableName, user);
    if (!sensorData) {
      Alert.alert(
        `No sensor data found for user ${user}`,
        `There is no ${tableName} data for the given user.`
      );
      return;
    }
    return sensorData;
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert(`Error getting data from ${tableName} table`, e.message);
    } else {
      Alert.alert(
        `Error getting data from ${tableName} table`,
        'Unknown error'
      );
    }
  }
}

/**
 * The function `convertDBToCSV` takes an array of objects and converts it into a CSV string.
 * @param {{ [column: string]: unknown }[]} data - An array of objects representing rows of data from a
 * database. Each object should have keys representing column names and values representing the data in
 * each column.
 * @returns a string that represents the data in CSV format.
 */
function convertDBToCSV(data: { [column: string]: unknown }[]): string {
  const headers = Object.keys(data[0]).join(',') + '\n';
  const rowsCSV = data.map(data => Object.values(data).join(',')).join('\n');
  return headers + rowsCSV;
}

/**
 * The function saves a CSV string to a file in a specified folder, with the file name being based on
 * the table name and the user number.
 * @param {string} tableName - The tableName parameter is a string that represents the name of the
 * table or file that the CSV data belongs to.
 * @param {string} csvString - The `csvString` parameter is a string that represents the content of a
 * CSV file. It contains the data that needs to be saved to a file.
 * @param {number} user - The `user` parameter is the user ID or identifier. It is used to create a
 * unique folder for each user to store their files.
 * @returns a Promise that resolves to a string representing the file path if the file is successfully
 * saved, or void (undefined) if there is an error.
 */
async function saveCSVToFile(
  tableName: string,
  csvString: string,
  user: number
): Promise<string | void> {
  try {
    const folderPath = `${FileSystem.documentDirectory}user-${user}/`;
    await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
    const filePath = `${folderPath}${tableName}.csv`;
    await FileSystem.writeAsStringAsync(filePath, csvString, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    // console.log(`Saved file to ${filePath}`);
    return filePath;
  } catch (e) {
    // console.log(`Error saving file: ${tableName} - `, e);
    if (e instanceof Error) {
      Alert.alert('Error saving file: ${tableName}', e.message);
    } else {
      Alert.alert('Error saving file: ${tableName}', 'Uknown Error');
    }
  }
}

async function saveUserCSVToFile(csvString: string): Promise<string | void> {
  try {
    const folderPath = `${FileSystem.documentDirectory}`;
    await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
    const filePath = `${folderPath}users.csv`;
    await FileSystem.writeAsStringAsync(filePath, csvString, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    // console.log(`Saved file to ${filePath}`);
    return filePath;
  } catch (e) {
    // console.log(`Error saving file: ${tableName} - `, e);
    if (e instanceof Error) {
      Alert.alert('Error saving file: users.csv', e.message);
    } else {
      Alert.alert('Error saving file: users.csv', 'Uknown Error');
    }
  }
}

async function shareFile(filePath: string, tableName: string): Promise<void> {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Sharing is not available', 'Sharing is not available');
    }

    await Sharing.shareAsync(filePath, {
      dialogTitle: `Sharing '${tableName}.csv' with`,
      mimeType: 'text/csv',
    });
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Error sharing file', e.message);
    } else {
      Alert.alert('Error sharing file', 'Uknown error');
    }
  }
}
