import pluginSecurity from "eslint-plugin-security"; 
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
    pluginSecurity.configs.recommended,

    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
];