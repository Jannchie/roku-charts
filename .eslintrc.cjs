module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['@jannchie'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}
