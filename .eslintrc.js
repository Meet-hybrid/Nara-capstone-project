// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  overrides: [
    {
      files: ['__tests__/**', 'jest.setup.js'],
      env: { jest: true },
    },
  ],
  globals: {
    AbortController: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    localStorage: 'readonly',
    sessionStorage: 'readonly',
  },
};
