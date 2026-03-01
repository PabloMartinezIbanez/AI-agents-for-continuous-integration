import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Configuración para archivos JavaScript
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Reglas recomendadas + extras para tus pruebas
      "semi": ["error", "always"],              // obliga a usar ; al final de líneas
      "no-extra-semi": "error",                 // prohíbe ; innecesarios o en lugares raros
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }], // máximo 1 línea en blanco consecutiva
      "eol-last": ["error", "always"],          // obliga a terminar con línea en blanco
      "no-trailing-spaces": "error",            // prohíbe espacios al final de línea
      "no-unused-vars": "warn",                 // avisa variables no usadas
      "no-console": "off"                       // permite console.log
    }
  },

  // Configuración para JSON/JSONC
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
    rules: {
      // Reglas recomendadas + extras para JSON estricto
      "json/*": ["error", "allowComments"],  // permite comentarios (útil en package.json)
      "json/syntax-error": "error",          // detecta errores de sintaxis JSON
      "json/undefined": "error",             // prohíbe valores undefined
      "json/no-duplicate-keys": "error",     // prohíbe keys duplicadas
      "json/no-trailing-comma": "error",     // prohíbe trailing commas en JSON estricto
      "json/sort-keys": "off"                // opcional: ordenar keys alfabéticamente
    }
  },

  // Configuración específica para JSONC (JSON con comentarios)
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
    rules: {
      "json/*": ["error", "allowComments"],  // comentarios permitidos en JSONC
      "json/syntax-error": "error",
      "json/no-duplicate-keys": "error",
      "json/trailing-comma": "error",        // permite trailing comma en JSONC
      "json/comments": "error"               // obliga a tener comentarios válidos (opcional)
    }
  }
]);