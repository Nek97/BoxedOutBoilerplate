module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.dev.json',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['apps/**/*.js', 'libs/**/src/**/*.js'],
      env: {
        es6: true,
        node: true,
        commonjs: true,
      },
      plugins: [],
      extends: 'eslint:recommended',
      parserOptions: {
        ecmaVersion: 2018,
        project: 'tsconfig.json',
      },
      rules: {
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-unused-vars': 1,
      },
    },
    {
      files: ['apps/**/*.ts', 'libs/**/src/**/*.ts'],
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'error',
        eqeqeq: 1,
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      plugins: ['@typescript-eslint/eslint-plugin'],
    },
  ],
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '**/node_modules',
    '**/test',
    '**/docs',
    '**/*spec.ts',
    '**/__tests__',
    '**/__mocks__',
    '**/jest.config.ts',
  ],
};
