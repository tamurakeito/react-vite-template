import React, { ReactNode, useContext, useEffect } from "react";
import {
  useLocalStorage,
  tokenStorageKey,
  userStorageKey,
} from "@view/hooks/useLocalStrage";
import { useLocation } from "react-router-dom";
import { User } from "@domain/entity/auth";

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
  useEffect(
    () => {
      // ログインしていない場合
      if (!user?.userId) {
        if (token) return;
        signOut();
      }

      // セッション切れの場合
      const untilSessionExpire = 1440000; // １日分のミリ秒 // １日経過するとセッション切れとなる
      const userSession = user?.session || undefined;
      if (!userSession || Date.now() - userSession > untilSessionExpire) {
        signOut();
      }

      // トークンが無効である場合
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, token]
  );

  const location = useLocation();

  useEffect(
    () => {
      if (
        location.pathname.startsWith("/sign-in") ||
        location.pathname.startsWith("/sign-up")
      ) {
        signOut();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname]
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextType => {
  return useContext(AuthContext);
};
