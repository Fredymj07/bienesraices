export default {
    env: {
      node: true,
      commonjs: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    overrides: [
      {
        files: ['*.js', '*.ts'],
        // Configuración específica para archivos .js y .ts
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
        },
      },
    ],
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': ['error'],
      'eqeqeq': 'error',
      'curly': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
    },
  };
  