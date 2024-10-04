import antfu from '@antfu/eslint-config';

type AntfuParams = Parameters<typeof antfu>;

async function empathyco(options: AntfuParams[0] = {}, ...userConfigs: AntfuParams[1][]) {
  return antfu(
    {
      stylistic: false, // Disable https://eslint.style,
      formatters: false, // https://github.com/antfu/eslint-config?tab=readme-ov-file#prettier
      typescript: {
        tsconfigPath: 'tsconfig.json'
      },
      ...options
    },
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
    },
    ...userConfigs
  );
}

export default empathyco;

/**
 * Pending:
 * Prettier
 * Stylelint?
 * Publish NPM package (GitHub actions)
 */