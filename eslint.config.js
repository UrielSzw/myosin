// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const tanstackQuery = require("@tanstack/eslint-plugin-query");

module.exports = defineConfig([
  expoConfig,

  // TanStack Query plugin
  {
    plugins: {
      "@tanstack/query": tanstackQuery,
    },
    rules: {
      // Asegura que las query keys incluyan todas las dependencias
      "@tanstack/query/exhaustive-deps": "error",
      // Asegura que el queryClient sea estable
      "@tanstack/query/stable-query-client": "error",
      // Previene errores comunes en queries
      "@tanstack/query/no-rest-destructuring": "warn",
    },
  },

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
    },
  },

  // Ignores
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*", "drizzle/*"],
  },
]);
