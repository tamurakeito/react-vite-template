import React, { ReactNode, useContext, useEffect } from "react";
import useLocalStorage, {
  tokenStorageKey,
  userStorageKey,
} from "@/hooks/useLocalStrage";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/types";

type AuthContextType = {
  user?: User;
  signIn: (id: number, userId: string, name: string, token: string) => void;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextType>({
  signOut: () => {
    console.log("sign out unimplemented");
  },
  signIn: () => {
    console.log("sign in unimplemented");
  },
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | undefined>(
    userStorageKey,
    undefined
  );
  const [token, setToken] = useLocalStorage<string | undefined>(
    tokenStorageKey,
    undefined
  );
  const signIn = (id: number, userId: string, name: string, token: string) => {
    const account = {
      id: id,
      userId: userId,
      name: name,
      session: Date.now(),
    };
    setUser(account);
    setToken(token);
  };
  const signOut = () => {
    setUser(undefined);
    setToken(undefined);
  };

  // redirect to signin
  const navigation = useNavigate();
  useEffect(
    () => {
      // ログインしていない場合
      const userUser = user?.userId || undefined;
      if (!!!userUser) {
        signOut();
      }

      // セッション切れの場合
      const untilSessionExpire = 1440000; // １日分のミリ秒 // １日経過するとセッション切れとなる
      const userSession = user?.session || undefined;
      if (!!!userSession || Date.now() - userSession > untilSessionExpire) {
        signOut();
      }

      // /sign-in, /sign-up のパスへ移動した際にアカウントクリアする
      if (
        window.location.pathname.indexOf("/sign-in") === 0 ||
        window.location.pathname.indexOf("/sign-up") === 0
      ) {
        signOut();
      }

      // トークンが無効である場合
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, token, navigation]
  );

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  return useContext(AuthContext);
};
