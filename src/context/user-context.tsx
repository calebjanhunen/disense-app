import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from 'react';

import { User } from '@/interfaces/User';

interface Props {
  children: React.ReactNode;
}

export interface IUserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
