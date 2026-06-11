import { create } from 'zustand';

export type IframeUserData = {
  id?: string | number;
  userId?: string | number;
  [key: string]: unknown;
};

type AuthState = {
  token: string | null;
  userData: IframeUserData | null;
  setAuthData: (authData: { token?: string | null; userData?: IframeUserData | null }) => void;
  clearAuthData: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userData: null,
  setAuthData: ({ token, userData }) => {
    set({
      token: token ?? null,
      userData: userData ?? null,
    });
  },
  clearAuthData: () => {
    set({
      token: null,
      userData: null,
    });
  },
}));
