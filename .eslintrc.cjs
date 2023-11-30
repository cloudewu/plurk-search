module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.eslint.json',
      './web/tsconfig.json',
      './api/tsconfig.eslint.json',
      './packages/**/tsconfig.json',
    ],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  extends: [
    'standard-with-typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  rules: {
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
  },
  overrides: [
    {
      files: ['**/.eslintrc.{js,cjs}'],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['**/*.spec.ts'],
      rules: {
        'no-multiple-empty-lines': ['error', { max: 3 }],
      },
    },
  ],
};
