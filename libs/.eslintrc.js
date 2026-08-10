module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: ['../apps', 'boxedout', 'boxedout-libs'],
        patterns: [
          '@boxedout-app',
          '@boxedout-app/*',
          '@boxedout',
          '@boxedout/*',
          '@boxedout-libs',
          '@boxedout-libs/*',
        ],
      },
    ],
  },
};
