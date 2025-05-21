// @ts-check
import { loadPrettierPlugins } from './src/utils/loadPrettierPlugins.js'
/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  singleQuote: true,
  arrowParens: 'avoid',
  semi: false,
  plugins: loadPrettierPlugins(),
  overrides: [
    {
      files: '*.svg',
      options: {
        parser: 'html',
      },
    },
  ],
}

export default config
