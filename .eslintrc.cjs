/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@shopify/typescript', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  root: true,
  rules: {
    'prettier/prettier': ['error'],
    '@shopify/binary-assignment-parens': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  overrides: [
    {
      files: ['src/env.ts'],
      rules: {
        'no-process-env': 'off',
      },
    },
    {
      files: ['src/interfaces/fastify/error-handler.ts', 'src/index.ts'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
}
