/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */

import React, { PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import { LoginResponseDto } from "components/models/LoginResponseDto";
import { ChoreEngineTokens } from "components/models/chore-engine.tokens";

interface IAuthContext {
  initAuth: (tokens: ChoreEngineTokens) => void;
  signOut: () => void;
  session?: string | null;
  appLoading: boolean;
  setAppLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoginResponse: (usr: LoginResponseDto) => void;
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
  const [[_, session], setSession] = useStorageState("tokens");
  const [appLoading, setAppLoading] = React.useState<boolean>(false);
  const [loginResponse, setLoginResponse] = React.useState<LoginResponseDto>(
    {} as LoginResponseDto
  );

  const handleLoginResponse = React.useCallback((usr: LoginResponseDto) => {
    setLoginResponse(usr);
  }, []);

  const value: IAuthContext = React.useMemo(
    () => ({
      initAuth: (tokens: ChoreEngineTokens) => {
        // Perform sign-in logic here
        setSession(JSON.stringify(tokens));
      },
      signOut: () => {
        setSession(null);
      },
      session,
      appLoading,
      setAppLoading,
      loginResponse,
      handleLoginResponse,
    }),
    [appLoading, handleLoginResponse, loginResponse, session, setSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
