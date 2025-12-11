import { addImports, defineNuxtModule } from '@nuxt/kit'
import * as lodash from 'lodash-es'

const excludeDefaults = [
  'wrapperValue',
  'wrapperToIterator',
  'wrapperReverse',
  'wrapperPlant',
  'wrapperNext',
  'wrapperLodash',
  'wrapperCommit',
  'wrapperChain',
  'wrapperAt',
  'templateSettings',
  'toIterator',
  'VERSION',
  'lodash',
  'value',
  'valueOf',
  'toJSON',
  'thru',
  'plant',
  'next',
  'default',
  'commit',
  'head',
]

export interface ModuleOptions {
  /**
   * Prefix to be added before every lodash function
   * Set to `false` to disable prefixing.
   * @defaultValue `use`
   */
  prefix: false | string
  /**
   * Functions that starts with this keywords will be skipped by prefix.
   * Set to `false` to disable uppercasing.
   * @defaultValue 'is'
   */
  prefixSkip: string | false
  /**
   * Array of lodash funcions to be exluded from auto-imports.
   * @defaultValue []
   */
  exclude: string[]
  /**
   * Upper case first letter after prefix.
   * @defaultValue true
   */
  upperAfterPrefix: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-lodash',
    configKey: 'lodash',
  },
  defaults: {
    prefix: '_',
    prefixSkip: 'is',
    upperAfterPrefix: true,
    exclude: [],
  },
  setup(options) {
    const excludes = [...options.exclude, ...excludeDefaults]
    for (const name of Object.keys(lodash)) {
      if (excludes.includes(name)) continue
      const prefix = options.prefixSkip && name.startsWith(options.prefixSkip) ? '' : options.prefix
      const as = prefix ? prefix + (options.upperAfterPrefix ? lodash.upperFirst(name) : name) : name
      addImports({ name, as, from: 'lodash-es' })
    }
  },
})
