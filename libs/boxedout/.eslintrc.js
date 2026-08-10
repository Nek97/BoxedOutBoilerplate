module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: ['../../apps'],
        patterns: ['@boxedout-app', '@boxedout-app/*'],
      },
    ],
  },
};
