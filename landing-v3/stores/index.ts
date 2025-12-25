import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
    role: null,
    rememberMe: false
  }),
  actions: {
    login(userData, token, rememberMe) {
      this.user = userData;
      this.token = token;
      
      // Normalize roles to 'provider' or 'client'
      const rawRole = userData.role?.toLowerCase() || 'client';
      if (['admin', 'provider', 'pilot'].includes(rawRole)) {
        this.role = 'provider';
      } else {
        this.role = 'client';
      }
      
      this.isAuthenticated = true;
      this.rememberMe = rememberMe;
    },
    logout() {
      this.user = null;
      this.token = null;
      this.role = null;
      this.isAuthenticated = false;
    }
  },
  persist: true
});

export const useAppStore = defineStore('app', {
  state: () => ({
    locale: 'en'
  }),
  actions: {
    setLocale(newLocale) {
      this.locale = newLocale;
    }
  },
  persist: true
});
