import { TestInfoContext } from '@/context/test-info-context';
import { getAllUsersFromDb, insertUser } from '@/db/user-repository';
import { User } from '@/interfaces/User';
import { handleError } from '@/utils/error-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';

interface IUseUserData {
  saveUser: (user: User) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  removeCurrentUser: () => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  setSelectedUser: (userId: number) => Promise<void>;
  deleteAllDataForSelectedUser: (userId: number) => Promise<void>;
  isSaving: boolean;
}

export function useUserData(): IUseUserData {
  const { setUser } = useContext(TestInfoContext);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  async function saveUser(user: User): Promise<void> {
    setIsSaving(true);
    try {
      const userId = await insertUser(user);
      if (!userId) {
        handleError('Error saving user. ', 'Could not save user');
        return;
      }
      setUser(userId);
      await saveUserToAsyncStorage(userId);
      Alert.alert('Success', `User ${userId} saved successfully`);
    } catch (e) {
      handleError('Error saving user', e);
    } finally {
      setIsSaving(false);
    }
  }

  async function saveUserToAsyncStorage(userId: number): Promise<void> {
    await AsyncStorage.setItem('current_user', userId.toString());
  }

  async function getCurrentUser(): Promise<void> {
    try {
      const currentUser = await AsyncStorage.getItem('current_user');
      if (currentUser) setUser(parseInt(currentUser));
    } catch (e) {
      handleError('Error getting current user.', e);
    }
  }

  async function removeCurrentUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem('current_user');
      setUser(0);
    } catch (e) {
      handleError('Could not remove current user.', e);
    }
  }

  async function getAllUsers(): Promise<User[]> {
    try {
      const users = await getAllUsersFromDb();
      return users;
    } catch (e) {
      handleError('Could not get users.', e);
      return [];
    }
  }

  async function setSelectedUser(userId: number): Promise<void> {
    setUser(userId);
    try {
      await saveUserToAsyncStorage(userId);
    } catch (e) {
      handleError('Could not set user to selected user', e);
    }
  }

  async function deleteAllDataForSelectedUser(userId: number): Promise<void> {
    try {
      console.log('deleted');
    } catch (e) {
      handleError(`Could not delete data for user: ${userId}`, e);
    }
  }

  return {
    getCurrentUser,
    saveUser,
    isSaving,
    removeCurrentUser,
    getAllUsers,
    setSelectedUser,
    deleteAllDataForSelectedUser,
  };
}
