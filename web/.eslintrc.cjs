module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@next/next/recommended',
  ],
  plugins: [
    'react',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  overrides: [],
};
