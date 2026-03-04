// eslint.config.ts
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import vue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import importPlugin from "eslint-plugin-import"
import unusedImports from "eslint-plugin-unused-imports"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },

  js.configs.recommended,

  // Vue rules (flat)
  ...vue.configs["flat/recommended"],

  // TS type-aware rules on TS/TSX only (avoid parsing <template> as TS)
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["src/**/*.{ts,tsx}"],
  })),

  // Parse .vue SFC properly (template + <script setup lang="ts">)
  {
    files: ["src/**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        project: "./tsconfig.eslint.json",
        extraFileExtensions: [".vue"],
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },

  // TS/TSX language options (typed)
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },

  // Plugins + rules (Vue + TS + imports)
  {
    files: ["src/**/*.{ts,tsx,vue}"],
    plugins: {
      vue,
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      /**
       * Prettier owns formatting
       */
      indent: "off",
      "vue/html-indent": "off",
      "vue/script-indent": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/max-attributes-per-line": "off",

      /**
       * TS strict ergonomique
       */
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",

      // unused handled by unused-imports
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      /**
       * Imports
       */
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",

      /**
       * Vue
       */
      "vue/multi-word-component-names": "off",
      "vue/no-unused-vars": "error",
      "vue/component-api-style": ["error", ["script-setup"]],
    },
  },

  // Plain JS files: keep it simple
  {
    files: ["**/*.{js,mjs,cjs}"],
  },

  // Must be last: disables ESLint rules that conflict with Prettier
  eslintConfigPrettier,
]
