import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from 'react';

interface Props {
  children: React.ReactNode;
}

export interface IUserContext {
  user: number;
  setUser: Dispatch<SetStateAction<number>>;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<number>(0);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
