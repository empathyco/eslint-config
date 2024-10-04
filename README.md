# @empathyco/eslint-config

- [@antfu/eslint-config](https://github.com/antfu/eslint-config) as default ESLint config preset.
- [prettier](https://github.com/prettier/prettier) as code formatter sharing config preset.
- [@eslint/config-inspector](https://github.com/eslint/config-inspector) the visual tool for inspecting and understanding your ESLint flat configs.
- Requires ESLint v9.11.0+

## Usage

### Install

```bash
npm i -D prettier eslint @empathyco/eslint-config
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import empathyco from '@empathyco/eslint-config';

export default empathyco();
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:inspect": "eslint . --inspect-config",
    "prettier": "prettier --write ."
  }
}
```