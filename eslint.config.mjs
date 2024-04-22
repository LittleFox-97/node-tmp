// @ts-check

import antfu from '@antfu/eslint-config'
import * as mochaPlugin from 'eslint-plugin-mocha'

export default antfu(
  {
    stylistic: true,
    jsonc: true,
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
    jsx: false,
    vue: false,
    yaml: false,
    markdown: false,
    ignores: ['**/docs'],
    test: true,
  },
  {
    plugins: {
      mocha: mochaPlugin,
    },
    files: ['**/*.js'],
    rules: {
      'curly': ['error', 'all'],
      'style/brace-style': ['error', '1tbs'],
      'no-console': 'warn',
      'complexity': ['warn', 8],
      'style/comma-dangle': ['error', 'never'],
      'node/prefer-global/process': ['error', 'always'],
      'node/prefer-global/buffer': ['error', 'always'],
    },
  },
  { files: ['**/*.ts'], rules: {
    'curly': ['error', 'all'],
    'style/brace-style': ['error', '1tbs'],
    'no-console': 'warn',
    'complexity': ['warn', 8],
    'style/comma-dangle': ['error', 'never'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/buffer': ['error', 'always'],
  } },
)
