/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@shopify/typescript', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  root: true,
  rules: {
    'prettier/prettier': ['error'],
  },
  overrides: [
    {
      files: ['src/env.ts'],
      rules: {
        'no-process-env': 'off',
      },
    },
  ]
}
