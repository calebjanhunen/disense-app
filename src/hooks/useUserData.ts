import { TestInfoContext } from '@/context/test-info-context';
import { getById, insertUser } from '@/db/user-repository';
import { User } from '@/interfaces/User';
import { handleError } from '@/utils/error-handler';
import { useContext } from 'react';

interface IUseUserData {
  saveUser: (user: User) => Promise<boolean>;
  getUser: (userId: number) => Promise<void>;
}

export function useUserData(): IUseUserData {
  const { setUser } = useContext(TestInfoContext);
  //   const [user, setUser] = useState<User>();

  async function saveUser(user: User): Promise<boolean> {
    try {
      const userId = await insertUser(user);
      if (userId) setUser(userId);
      return true;
    } catch (e) {
      handleError('Error saving user', e);
      return false;
    }
  }

  async function getUser(userId: number): Promise<void> {
    try {
      const user = await getById(userId);
      console.log(user);
      //   setUser(user);
    } catch (e) {
      handleError('Error getting user', e);
    }
  }

  return { getUser, saveUser };
}
