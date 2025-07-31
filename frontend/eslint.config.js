export default {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended"],
  ignorePatterns: ["dist", "node_modules"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "18.2",
    },
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
  },
  overrides: [
    {
      files: ["**/__tests__/**/*", "**/*.test.{js,jsx}", "**/*.spec.{js,jsx}"],
      env: {
        jest: true,
      },
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
  ],
};
