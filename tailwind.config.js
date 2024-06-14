import { theme } from 'antd';

const { fontFamily } = require('tailwindcss/defaultTheme');

const antdThemeColors = Object.fromEntries(
  Object.entries(
    theme.getDesignToken({
      token: {
        colorPrimary: '#ea9010',
        colorInfo: '#ea9010',
        colorBgBase: '#181717',
      },
      algorithm: theme.darkAlgorithm,
    }),
  ).filter(
    ([_, value]) =>
      typeof value === 'string' &&
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
  ),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  darkMode: ['class'],
  content: ['./src/**/*.{tsx,css}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1360px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      colors: antdThemeColors,
    },
  },
  plugins: [],
};
