import antfu from '@antfu/eslint-config';

type AntfuParams = Parameters<typeof antfu>;

export async function empathyco(options: AntfuParams[0] = {}, ...userConfigs: AntfuParams[1][]) {
  return antfu(
    {
      stylistic: false, // Disable https://eslint.style,
      formatters: false, // https://github.com/antfu/eslint-config?tab=readme-ov-file#prettier
      vue: true,
      typescript: {
        tsconfigPath: 'tsconfig.json'
      },
      ignores: ['.loaded_actions'],
      ...options
    },
    {
      rules: {
        'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
        // Disable extra stylistic rules that conflicts with prettier
        'vue/singleline-html-element-content-newline': 'off'
      }
    },
    {
      files: ['**/*.spec.{ts,tsx,js,jsx}'],
      rules: {
        'ts/explicit-function-return-type': 'off'
      }
    },
    ...userConfigs
  );
}

/**
 * Pending:
 * Stylelint?
 * Publish NPM package (GitHub actions)
 */
