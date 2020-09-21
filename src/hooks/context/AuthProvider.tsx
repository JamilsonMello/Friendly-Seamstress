import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import { firebase } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';

interface SignInProps {
  email: string;
  password: string;
}

interface DataProps {
  email: string;
  uid: string;
}

interface AuthContextProps {
  provider: DataProps;
  signed: boolean;
  loading: boolean;
  signIn(credentials: SignInProps): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DataProps>({} as DataProps);

  useEffect(() => {
    async function loadData(): Promise<void> {
      const userData = await AsyncStorage.getItem('@seamstress:user');

      if (userData) {
        setData(JSON.parse(userData));
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const signIn = useCallback(async ({ email, password }): Promise<void> => {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const { uid } = response.user;

    setData({
      uid,
      email,
    });

    await AsyncStorage.setItem(
      '@seamstress:user',
      JSON.stringify({ uid, email }),
    );
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await AsyncStorage.removeItem('@seamstress:user');

    setData({} as DataProps);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        provider: data,
        signed: !!data.uid,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}

export { AuthProvider, useAuth };
