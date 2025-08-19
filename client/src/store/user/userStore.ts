// store.ts
import { create } from "zustand";
import { RawUser, User } from "types/user";
import axios from "axios";
import { queryClient } from "lib/queryClient";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:8000";

export interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  refetchUser: (id: string) => void;
  updateUser: (newFields: Partial<RawUser>) => Promise<boolean>;

  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  isCheckingAuth: boolean;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  setUser: (user) => set(() => ({ user })),
  updateUser: async (newFields) => {
    try {
      const { user } = useUserStore.getState();
      if (!user) return false;

      const response = await axios.put(
        `${BASE_URL}/user/update/` + user._id,
        newFields
      );
      const { user: newUser } = response.data;
      set(() => ({ user: newUser }));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  refetchUser: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/` + id);
      const { user } = response.data;
      set(() => ({ user }));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  signup: async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup/`, {
        username,
        password,
      });

      const { user } = response.data;
      set(() => ({ user, isAuthenticated: true }));
      return true;
    } catch (e) {
      console.error(e);
      return false; //in a real application we should return a more detailed error
    }
  },
  login: async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login/`, {
        username,
        password,
      });

      const { user } = response.data;
      set(() => ({ user, isAuthenticated: true }));
      return true;
    } catch (e) {
      console.error(e);
      return false; //in a real application we should return a more detailed error
    }
  },
  logout: async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout/`);
      set(() => ({ user: null, isAuthenticated: false }));
      queryClient.clear();
    } catch (e) {
      console.error(e);
    }
  },
  checkAuth: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/check-auth/`);
      const { user } = response.data;
      set(() => ({ user, isAuthenticated: true }));
    } catch (error) {
      queryClient.clear();
      console.log(error);
    } finally {
      set(() => ({ isCheckingAuth: false }));
    }
  },
}));

export default useUserStore;
