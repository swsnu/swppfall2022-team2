module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true, // This is for jest
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'], // This is for Typescript
  },
  plugins: ['react'],
  rules: { 'react/prop-types': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off' },
};
