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
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '~/controllers/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '~/models/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '~/env',
            group: 'external',
            position: 'after',
          }
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ]
  },
  overrides: [
    {
      files: ['src/env.ts'],
      rules: {
        'no-process-env': 'off',
      },
    },
    {
      files: ['src/error-handler.ts', 'src/index.ts'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['src/models/mikro-orm/index.ts'],
      rules: {
        'import/extensions': 'off'
      }
    },
    {
      files: ['src/models/pg/entities/**', 'src/models/pg/transformers/**'],
      rules: {
        '@typescript-eslint/naming-convention': 'off'
      }
    }
  ]
}
