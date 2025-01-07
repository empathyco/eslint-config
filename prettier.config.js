const config = {
  printWidth: 100,
  singleQuote: true,
  arrowParens: 'avoid',
  semi: false,
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
