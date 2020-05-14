module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2020: true,
  },

  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  extends: ["standard", "eslint:recommended", "plugin:prettier/recommended"],

  plugins: ["prettier"],

  // add your custom rules here
  rules: {
    // Enforce import order
    "import/order": "error",
    // Imports should come first
    "import/first": "error",
    // Enforce arrow function parenthesis
    "arrow-parens": 1,
    // Warn about console statements
    "no-console": "warn",
    // warn about debug statements
    "no-debugger": "warn",

    // Prettier

    // Enforce arrow function parenthesis
    "prettier/prettier": [
      "error",
      {
        arrowParens: "always",
        singleQuote: false,
      },
    ],
  },
};
