import { loadPrettierPlugins } from './src/utils/loadPrettierPlugins.js'

export default {
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
