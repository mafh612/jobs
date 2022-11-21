const typescriptRules = require('@mafh/linter/src/typescript.rules')

module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  overrides: [
    typescriptRules,
    {
      files: ['**/*.ts'],
      rules: {
        curly: 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'enum',
            format: ['PascalCase']
          }
        ]
      }
    },
    {
      files: ['resources/ts/**/*.ts'],
      rules: {
        'prefer-arrow/prefer-arrow-functions': false
      }
    }
  ]
}
