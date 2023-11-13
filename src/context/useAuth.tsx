/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */

import React, { PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import { LoginResponseDto } from "models/LoginResponseDto";
import { ChoreEngineTokens } from "models/chore-engine.tokens";

interface IAuthContext {
  initAuth: (authStore: IChoreEngineAuthStorage) => void;
  signOut: () => void;
  session?: IChoreEngineAuthStorage | null;
  appLoading: boolean;
  isAuthenticated: boolean;
  setAppLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoginResponse: (usr: LoginResponseDto) => void;
  loginResponse: LoginResponseDto | null;
  storeLoading: boolean;
}

export interface IChoreEngineAuthStorage {
  tokens: ChoreEngineTokens;
  loginResponse: LoginResponseDto;
}

const AuthContext = React.createContext<IAuthContext | undefined>(undefined);

// This hook can be used to access the user info.
export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [[storeLoading, session], setSession] = useStorageState("tokens");
  const [appLoading, setAppLoading] = React.useState<boolean>(false);
  const [loginResponse, setLoginResponse] = React.useState<LoginResponseDto>(
    {} as LoginResponseDto
  );

  const handleLoginResponse = React.useCallback((usr: LoginResponseDto) => {
    setLoginResponse(usr);
  }, []);

  const authSession: IChoreEngineAuthStorage = session
    ? JSON.parse(session)
    : null;

  const value: IAuthContext = React.useMemo(
    () => ({
      initAuth: (auth: IChoreEngineAuthStorage) => {
        // Perform sign-in logic here
        setSession(JSON.stringify(auth));
      },
      signOut: () => {
        setSession(null);
      },
      session: authSession,
      appLoading,
      setAppLoading,
      loginResponse: authSession?.loginResponse || {},
      isAuthenticated: !!session,

      handleLoginResponse,
      storeLoading,
    }),
    [
      appLoading,
      authSession,
      handleLoginResponse,
      session,
      setSession,
      storeLoading,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
