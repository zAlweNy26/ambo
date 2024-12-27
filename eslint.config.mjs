// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import antfu from '@antfu/eslint-config'

export default withNuxt(
  antfu({
    stylistic: {
      indent: 'tab',
      quotes: 'single',
    },
    typescript: true,
    vue: true,
    jsonc: true,
    yaml: true,
    markdown: true,
    rules: {
      'node/prefer-global/process': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/attribute-hyphenation': 'off',
      'array-bracket-spacing': 'off',
      'one-var': 'off',
      'no-console': 'off',
      'jsdoc/check-param-names': 'off',
      'curly': ['warn', 'multi-or-nest'],
      'antfu/if-newline': 'off',
      'antfu/curly': 'off',
      'antfu/consistent-list-newline': 'off',
      'brace-style': 'off',
      'vue/html-closing-bracket-newline': 'off',
    },
  })
)
