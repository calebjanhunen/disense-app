import { handleError } from '@/utils/error-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

interface Props {
  children: React.ReactNode;
}

export interface ITestInfoContext {
  user: number;
  setUser: Dispatch<SetStateAction<number>>;
  isTestRunning: boolean;
  beginTest: () => Promise<void>;
  endTest: () => Promise<void>;
}

export const TestInfoContext = createContext<ITestInfoContext>(
  {} as ITestInfoContext
);

export function TestInfoProvider({ children }: Props) {
  const [user, setUser] = useState<number>(0);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);

  useEffect(() => {
    getIsTestRunning();
  }, []);

  async function beginTest(): Promise<void> {
    setIsTestRunning(true);
    try {
      await AsyncStorage.setItem('test_running', 'true');
    } catch (e) {
      handleError('Could not start test', e);
    }
  }

  async function endTest(): Promise<void> {
    setIsTestRunning(false);
    try {
      await AsyncStorage.removeItem('test_running');
    } catch (e) {
      handleError('Could not stop test', e);
    }
  }

  async function getIsTestRunning() {
    try {
      const result = await AsyncStorage.getItem('test_running');
      if (result === 'true') {
        setIsTestRunning(true);
      }
    } catch (e) {
      handleError('Could not figure out if test was running', e);
    }
  }

  return (
    <TestInfoContext.Provider
      value={{
        user,
        setUser,
        isTestRunning,
        beginTest,
        endTest,
      }}
    >
      {children}
    </TestInfoContext.Provider>
  );
}
