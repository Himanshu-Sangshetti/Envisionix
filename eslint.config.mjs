import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-extra-semi": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "off",
      "react/display-name": "off",
      "react/no-deprecated": "off",
      "react/jsx-key": "off",
      "react/jsx-no-target-blank": "off",
      "react/no-unknown-property": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-sync-scripts": "off",
      "@next/next/no-css-tags": "off",
      "import/no-anonymous-default-export": "off",
      "import/prefer-default-export": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-shadow": "off",
      "no-undef": "off",
      "no-unused-expressions": "off",
      "no-use-before-define": "off",
      "no-empty": "off",
      "no-redeclare": "off",
      "no-useless-catch": "off",
      "no-var": "off",
      "prefer-const": "off"
    },
  },
];

export default eslintConfig;
