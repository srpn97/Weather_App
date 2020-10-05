module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'quotes': [0, 'single', 'double'],
    'indent': ['off', "tab"],
    "space-before-function-paren": ["warn", "always"],
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'vue/no-unused-components': 'warn',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}