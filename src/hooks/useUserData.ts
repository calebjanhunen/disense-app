import { TestInfoContext } from '@/context/test-info-context';
import { UserContext } from '@/context/user-context';
import { getAllUsersFromDb, getById, insertUser } from '@/db/user-repository';
import { User } from '@/interfaces/User';
import { handleError } from '@/utils/error-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';

interface IUseUserData {
  saveUser: (user: User) => Promise<void>;
  getCurrentUserFromAsyncStorage: () => Promise<void>;
  removeCurrentUserFromAsyncStorage: () => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  setSelectedUser: (userId: number) => Promise<void>;
  isSaving: boolean;
  user: User | null;
}

export function useUserData(): IUseUserData {
  const { setUser: setUserForTesting } = useContext(TestInfoContext);
  const { setUser, user } = useContext(UserContext);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  async function saveUser(newUser: User): Promise<void> {
    setIsSaving(true);
    try {
      const userId = await insertUser(newUser);
      if (!userId) {
        handleError('Error saving user. ', 'Could not save user');
        return;
      }
      setUserForTesting(userId);
      setUser(newUser);
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

  async function getCurrentUserFromAsyncStorage(): Promise<void> {
    try {
      const currentUser = await AsyncStorage.getItem('current_user');
      if (!currentUser) {
        return;
      }
      setUserForTesting(parseInt(currentUser));

      const user = await getById(parseInt(currentUser));
      if (!user) {
        throw new Error(`User with id: ${currentUser} does not exist`);
      }
      setUser(user);
    } catch (e) {
      handleError('Error getting current user.', e);
    }
  }

  async function removeCurrentUserFromAsyncStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem('current_user');
      setUserForTesting(0);
      setUser(null);
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
    try {
      const user = await getById(userId);
      if (user) {
        setUser(user);
      } else {
        throw new Error(`User with id: ${userId} does not exist`);
      }
    } catch (e) {
      handleError(`Could not find user with id: ${userId}`, e);
    }
    setUserForTesting(userId);
    try {
      await saveUserToAsyncStorage(userId);
    } catch (e) {
      handleError('Could not set user to selected user', e);
    }
  }

  return {
    getCurrentUserFromAsyncStorage,
    saveUser,
    isSaving,
    removeCurrentUserFromAsyncStorage,
    getAllUsers,
    setSelectedUser,
    user,
  };
}
