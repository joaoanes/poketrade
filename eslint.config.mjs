import stylistic from "@stylistic/eslint-plugin"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

const config = [{ignores: ["support/*", "out/*"],}, ...compat.extends("next/core-web-vitals", "eslint:recommended", "plugin:react/recommended"), {
  plugins: {
    "@stylistic": stylistic,
    "@typescript-eslint": typescriptEslint,
  },

  rules: {
    "@next/next/no-img-element": "off",

    "@stylistic/max-len": ["error", {
      code: 120,
      tabWidth: 4,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreComments: true,
    }],

    "@stylistic/jsx-wrap-multilines": ["error", {
      declaration: "parens-new-line",
      assignment: "parens-new-line",
      return: "parens-new-line",
      arrow: "parens-new-line",
    }],

    "@stylistic/jsx-one-expression-per-line": ["error", {allow: "non-jsx",}],

    "@stylistic/jsx-first-prop-new-line": ["error", "multiline"],
    "@stylistic/jsx-closing-bracket-location": ["error", "line-aligned"],
    "@stylistic/jsx-closing-tag-location": "error",
    "react/react-in-jsx-scope": "off",
    "@stylistic/jsx-indent": ["error", 2],
    "@stylistic/jsx-indent-props": ["error", 2],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@stylistic/operator-linebreak": ["error", "before"],

    "@stylistic/jsx-curly-newline": ["error", {
      multiline: "consistent",
      singleline: "consistent",
    }],

    "@stylistic/jsx-max-props-per-line": ["error", {
      maximum: 1,
      when: "always",
    }],

    "@stylistic/function-paren-newline": ["error", "multiline"],
    "@stylistic/function-call-argument-newline": ["error", "consistent"],

    "@stylistic/object-property-newline": ["error", {allowAllPropertiesOnSameLine: true,}],

    "@stylistic/object-curly-newline": ["error", {
      ObjectPattern: {
        multiline: true,
        minProperties: 3,
      },

      ObjectExpression: {
        multiline: true,
        minProperties: 3,
      },

      ImportDeclaration: "never",

      ExportDeclaration: {
        multiline: true,
        minProperties: 3,
      },
    }],

    "@stylistic/indent": ["error", 2, {
      SwitchCase: 1,
      VariableDeclarator: 1,
      outerIIFEBody: 1,
      MemberExpression: 1,

      FunctionDeclaration: {
        parameters: 1,
        body: 1,
      },

      FunctionExpression: {
        parameters: 1,
        body: 1,
      },

      CallExpression: {arguments: 1,},

      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      ignoreComments: false,

      ignoredNodes: [
        "JSXElement",
        "JSXElement > *",
        "JSXAttribute",
        "JSXIdentifier",
        "JSXNamespacedName",
        "JSXMemberExpression",
        "JSXSpreadAttribute",
        "JSXExpressionContainer",
        "JSXOpeningElement",
        "JSXClosingElement",
        "JSXFragment",
        "JSXOpeningFragment",
        "JSXClosingFragment",
        "JSXText",
        "JSXEmptyExpression",
        "JSXSpreadChild",
      ],
    }],

    "@stylistic/semi": ["error", "never"],

    "@stylistic/semi-spacing": ["error", {
      before: false,
      after: true,
    }],
  },
}]

export default config