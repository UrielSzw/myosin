// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const tanstackQuery = require("@tanstack/eslint-plugin-query");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
  expoConfig,

  // TanStack Query plugin
  {
    plugins: {
      "@tanstack/query": tanstackQuery,
    },
    rules: {
      // Asegura que las query keys incluyan todas las dependencias
      "@tanstack/query/exhaustive-deps": "warn",
      // Asegura que el queryClient sea estable
      "@tanstack/query/stable-query-client": "error",
      // Previene errores comunes en queries
      "@tanstack/query/no-rest-destructuring": "warn",
    },
  },

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Reglas generales
  {
    rules: {
      // Prevenir console.log accidentales (warn para no romper, solo avisar)
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Variables no usadas (ignorar si empiezan con _)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // React hooks
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // Desactivar reglas muy estrictas de typescript-eslint
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },

  // Ignores
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*", "drizzle/*"],
  },
]);
