import { createContext } from "react";
import { User } from "../types";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

// 기본
const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
});

// 업데이트용
const DispatchContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext>
  );
};
