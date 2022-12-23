module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['prettier', 'eslint:recommended', 'plugin:react/recommended'],
  parser: 'babel-eslint',
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
  rules: {
    'react/prop-types': 0,
  },
}
