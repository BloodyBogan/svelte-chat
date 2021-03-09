module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.json'],
      extraFileExtensions: ['.svelte']
    },
    "rules": {
      "no-undef": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/unbound-method": "off"
    },
    env: {
      es6: true,
      browser: true
    },
    overrides: [
      {
        files: ['*.svelte'],
        processor: 'svelte3/svelte3'
      }
    ],
    settings: {
      'svelte3/typescript': require('typescript'),
      'svelte3/ignore-styles': () => true
    },
    plugins: ['svelte3', '@typescript-eslint'],
    ignorePatterns: ['node_modules']
  }