import empathyco from './src';

export default empathyco(
  {},
  {
    // Example
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      'ts/explicit-function-return-type': 'off'
    }
  },
  {
    // Example
    rules: {
      // Disable extra stylistic rules that conflicts with prettier
      'vue/singleline-html-element-content-newline': 'off'
    }
  }
);
