import { createContext, useReducer } from "react";
import { User } from "../types";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

interface Action{
    type: string;
    payload: any
}

// 기본
const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
});

// 업데이트용
const DispatchContext = createContext<any>(null);

const reducer = (state: State, {type, payload}: Action) => {
    switch(type){
        case "LOGIN": 
            return {
                ...state,
                authenticated: true,
                user: payload
            }
        case "LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null
            }
        case "STOPLOADING":
            return {
                ...state,
                loading: false
            }
        default:
            throw new Error(`Unknown action type: ${type}`)
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

   const [state, dispatch] = useReducer(reducer, {
       user: null,
       authentiated: false,
       loading: true
   })

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext>
  );
};
