import { Locale } from 'antd/lib/locale';
import en_US from 'antd/locale/en_US';
import pt_BR from 'antd/locale/pt_BR';

export const languages: Record<
  string,
  { name: string; flag: string; unicode: string; antd: Locale }
> = {
  'pt-BR': {
    name: 'Português',
    flag: '🇧🇷',
    unicode: '1f1e7-1f1f7',
    antd: pt_BR,
  },
  'en-US': { name: 'English', flag: '🇺🇸', unicode: '1f1fa-1f1f8', antd: en_US },
};

export type ILanguage = {
  [K in keyof typeof languages]: {
    name: string;
    flag: string;
    unicode: string;
    antd: Locale;
  };
};

export const defaultLocale: keyof typeof languages = 'en-US';
