/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function projectConfig({ displayName, tsconfig, testMatch }) {
  const baseProjectConfig = {
    testEnvironment: 'node',
    moduleNameMapper: {
      '^~api/(.*)$': '<rootDir>/api/src/$1',
      '^~web/(.*)$': '<rootDir>/web/$1',
      '^@plurk-search/common/(.*)$': '<rootDir>/packages/common/src/$1',
    },
  };

  return {
    ...baseProjectConfig,
    displayName,
    testMatch,
    transform: {
      '^.+\\.(t|j)s$': [
        'ts-jest',
        {
          tsconfig,
        },
      ],
    },
  };
}

module.exports = {
  rootDir: './',
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  preset: 'ts-jest',
  projects: [
    projectConfig({
      displayName: 'API',
      tsconfig: '<rootDir>/api/tsconfig.json',
      testMatch: [
        '<rootDir>/api/**/*.spec.ts',
      ],
    }),
    projectConfig({
      displayName: 'pack/common',
      tsconfig: '<rootDir>/packages/common/tsconfig.json',
      testMatch: [
        '<rootDir>/packages/common/**/*.spec.ts',
      ],
    }),
  ],
};
