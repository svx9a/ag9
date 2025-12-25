import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import th from './locales/th.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import es from './locales/es.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    th,
    zh,
    ja,
    es
  }
});

// Auto-detect locale
const userLocale = navigator.language.split('-')[0];
if (['en', 'th', 'zh', 'ja', 'es'].includes(userLocale)) {
  i18n.global.locale.value = userLocale;
}

export default i18n;
