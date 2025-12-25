import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import th from './locales/th.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import es from './locales/es.json';

const messages = {
  en,
  th,
  zh,
  ja,
  es,
  'ar': {
    "dashboard": {
      "oversight": "الإشراف على الأسطول",
      "ops_status": "عمليات المركز العالمي"
    }
  }
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('user_locale') || 'en',
  fallbackLocale: 'en',
  messages,
});

export const isRTL = (locale: string) => ['ar', 'he', 'fa'].includes(locale);

export default i18n;
