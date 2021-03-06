const OFF = 0;
// const WARNING = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  extends: [
    // Typescript
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // React
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    // Prettier
    "prettier", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    // Import
    "plugin:import/recommended",
    "plugin:import/typescript", // to support Typescript with the eslint-plugin-import
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "no-console": ["error", { allow: ["warn", "error"] }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": [
      ERROR,
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],

    // Typescript has already validated the props.
    "react/prop-types": OFF,

    // Imports

    // Because Typescript does validate the imported values and types, we don't need these rules.
    // Also `eslint-plugin-import` has issues resolving Typescript modules. See this issue
    // https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/31
    "import/named": OFF,
    "import/default": OFF,
    // Make optional rules required
    "import/first": ERROR,
    "import/newline-after-import": ERROR,
    "import/no-duplicates": ERROR,
    "import/no-named-as-default": ERROR,
    "import/no-named-as-default-member": ERROR,
    "import/order": [
      ERROR,
      {
        groups: ["builtin", "external", "internal", "parent", "sibling"],
        pathGroups: [
          {
            pattern: "~/**",
            group: "internal",
          },
          {
            pattern: "@twingate/ui",
            group: "external",
          },
        ],
        "newlines-between": "never",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
