import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    rules: {
        "no-unused-vars": "off",
        "no-debugger": "off",
        "no-constant-binary-expression": "off",

    }
  }
];