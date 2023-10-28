// @ts-check

/** @type {import("syncpack").RcFile} */
module.exports = {
  versionGroups: [
    {
      dependencies: [
        'lint-staged',
        'eslint',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        'eslint-config-next',
        'eslint-config-standard-with-typescript',
        'eslint-plugin-import',
        'eslint-plugin-n',
        'eslint-plugin-promise',
        'eslint-plugin-react',
      ],
      packages: ['**'],
      label: 'unified linting utilities',
    },
    {
      dependencies: [
        'typescript',
        '@types/express',
        '@types/jest',
        '@types/node',
        '@types/react',
        '@types/react-dom',
        '@types/supertest',
      ],
      packages: ['**'],
      label: 'unified types',
    },
    {
      dependencies: ['jest'],
      packages: ['**'],
      label: 'unified testing framework',
    }
  ],
};
