import type { Linter } from 'eslint'
import antfu from '@antfu/eslint-config'

type AntfuParams = Parameters<typeof antfu>

export async function empathyco(
  options: AntfuParams[0] = {},
  ...userConfigs: AntfuParams[1][]
): Promise<Linter.Config[]> {
  return antfu(
    {
      stylistic: false, // Disable https://eslint.style,
      formatters: false, // https://github.com/antfu/eslint-config?tab=readme-ov-file#prettier
      vue: true, // To be able to tweak vue rules here
      typescript: {
        tsconfigPath: 'tsconfig.json',
      },
      ignores: ['.loaded_actions'],
      ...options,
    },
    {
      rules: {
        'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
        // Disable vue rules that conflicts with Prettier
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-self-closing': 'off',
        'vue/html-indent': 'off',
        // https://typescript-eslint.io/rules/strict-boolean-expressions/
        '@typescript-eslint/strict-boolean-expressions': 'off',
      },
    },
    {
      files: ['**/*.spec.{ts,tsx,js,jsx}'],
      rules: {
        'ts/explicit-function-return-type': 'off',
      },
    },
    ...userConfigs,
  )
}
