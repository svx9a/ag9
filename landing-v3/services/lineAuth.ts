/**
 * LINE Authentication Service
 * Integrates with LINE Front-end Framework (LIFF) for seamless login.
 */

import liff from '@line/liff';

const LIFF_ID = import.meta.env.VITE_LINE_LIFF_ID || 'MOCK_LIFF_ID';

export const LineAuthService = {
  async init() {
    try {
      await liff.init({ liffId: LIFF_ID });
    } catch (error) {
      console.error('LIFF initialization failed', error);
    }
  },

  async login() {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  },

  async logout() {
    if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
  },

  async getProfile() {
    if (liff.isLoggedIn()) {
      return await liff.getProfile();
    }
    return null;
  },

  isLoggedIn() {
    return liff.isLoggedIn();
  }
};
