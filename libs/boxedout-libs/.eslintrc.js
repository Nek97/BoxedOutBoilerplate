module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: ['../../apps', '../boxedout'],
        patterns: ['@boxedout-app', '@boxedout-app/*', '@boxedout', '@boxedout/*'],
      },
    ],
  },
};
