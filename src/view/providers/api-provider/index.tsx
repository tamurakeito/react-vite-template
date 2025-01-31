import React, { ReactNode, useContext } from "react";
import { HelloWorldInjector } from "@/injector/example";
import { HelloWorldHandler } from "@/handler/example";
import { AuthHandler } from "@/handler/auth";
import { AuthInjector } from "@/injector/auth";

type ApiContextType = {
  helloWorldHandler: HelloWorldHandler;
  authHandler: AuthHandler;
};

const ApiContext = React.createContext<ApiContextType | undefined>(undefined);

export const ApiContextProvider = ({ children }: { children: ReactNode }) => {
  const helloWorldHandler = HelloWorldInjector.injectHelloWorldHandler();
  const authHandler = AuthInjector.injectAuthHandler();

  return (
    <ApiContext.Provider
      value={{
        helloWorldHandler,
        authHandler,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApiContext = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used within an ApiContextProvider");
  }
  return context;
};
