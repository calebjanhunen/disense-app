import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from 'react';

interface Props {
  children: React.ReactNode;
}

export interface ITestInfoContext {
  user: number;
  setUser: Dispatch<SetStateAction<number>>;
  isTestRunning: boolean;
  setIsTestRunning: Dispatch<SetStateAction<boolean>>;
}

export const TestInfoContext = createContext<ITestInfoContext>(
  {} as ITestInfoContext
);

export function TestInfoProvider({ children }: Props) {
  const [user, setUser] = useState<number>(0);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);

  return (
    <TestInfoContext.Provider
      value={{
        user,
        setUser,
        isTestRunning,
        setIsTestRunning,
      }}
    >
      {children}
    </TestInfoContext.Provider>
  );
}
