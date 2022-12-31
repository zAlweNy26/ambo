module.exports = {
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true,
        jquery: true
    },
    globals: {
        NodeJS: true
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
    },
    ignorePatterns: ["public/", "dist/", ".gitignore"],
    extends: [
        "plugin:astro/recommended",
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        "plugin:@typescript-eslint/recommended",
        "plugin:tailwindcss/recommended",
        "@vue/typescript/recommended",
        'plugin:vue/vue3-essential', // This option doesn't impose formatting rules
        // 'plugin:vue/vue3-strongly-recommended', // This option imposes formatting rules on your code to improve readability 
    ],
    rules: {
        "@typescript-eslint/consistent-type-imports": "warn",
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "warn",
        "vue/multi-word-component-names": "off",
        "vue/max-attributes-per-line": "off",
        "vue/first-attribute-linebreak": "off",
        "vue/html-indent": ["error", "tab", {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        "vue/html-closing-bracket-newline": ["warn", {
            "singleline": "never",
            "multiline": "never"
        }],
        "vue/v-on-event-hyphenation": "off",
        "vue/attribute-hyphenation": "off",
        "tailwindcss/no-custom-classname": "off",
    },
    overrides: [
        {
            files: ["*.astro"],
            parser: "astro-eslint-parser",
            parserOptions: {
                parser: "@typescript-eslint/parser",
                extraFileExtensions: [".astro"],
            },
            rules: {

            },
        },
    ],
}