/** @type {import('tailwindcss').Config} */
const {join} = require('path');

module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/components/*.{js,jsx,ts,tsx}',
    './src/pages/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard-Regular', 'sans-serif'],
        'pretendard-medium': ['Pretendard-Medium', 'sans-serif'],
        'pretendard-bold': ['Pretendard-Bold', 'sans-serif'],
      },
      fontSource: {
        local: join(__dirname, 'assets/fonts/'),
      },
    },
  },
  plugins: ['nativewind/babel'],
};
