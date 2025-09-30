const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const prettier = require("eslint-plugin-prettier");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "jest.setup.js",
      "*.xml",
      "**/generated/**",
      "**/fixtures/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
        allowImportExportEverywhere: true,
      },
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        beforeAll: "readonly",
        afterEach: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      prettier: prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "off",
    },
  },
];
