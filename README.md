# @empathyco/eslint-config

![NPM Version](https://img.shields.io/npm/v/%40empathyco%2Feslint-config)
[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

- [ESLint](https://eslint.org/) as code linter sharing configuration preset.
- [Prettier](https://github.com/prettier/prettier) as code formatter sharing configuration preset.
- [@antfu/eslint-config](https://github.com/antfu/eslint-config) as default ESLint config preset.
- [@eslint/config-inspector](https://github.com/eslint/config-inspector) the visual tool for inspecting and understanding your ESLint flat configs.

> [!NOTE]
> The ESLint and Prettier dependencies are referenced in the package itself, so there is no
> needed to install them in your project.

## Usage

### Install

```bash
npm i -D @empathyco/eslint-config
```

### ESLint config

Create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import { empathyco } from '@empathyco/eslint-config'

export default empathyco()
```

### Prettier config

Reference shared config file into `package.json`:

```json
{
  "prettier": "@empathyco/eslint-config/prettier"
}
```

### Add scripts for `package.json`

This is a script set that you can add to your repository:

```json
{
  "scripts": {
    "lint": "eslint --fix .",
    "lint:check": "eslint .",
    "lint:inspect": "eslint --inspect-config .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### Customization

Configure the initial preset with the same parameters as expose [@antfu/eslint-config](https://github.com/antfu/eslint-config/blob/main/README.md#customization)

Example:

```js
import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  // Configures for empathyco's (antfu) config.
  {},
  // From the second arguments they are ESLint Flat Configs.
  // You can have multiple configs.
  {
    rules: {
      'vue/custom-event-name-casing': 'off',
    },
  },
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      'jsdoc/check-param-names': 'off',
    },
  },
)
```
