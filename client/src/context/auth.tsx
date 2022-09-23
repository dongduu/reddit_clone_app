import { User } from "../types";

interface State {
  aythenticated: boolean;
  user: User | undefined;
  loading: boolean;
}
