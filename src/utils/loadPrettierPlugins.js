import { existsSync, globSync, readFileSync } from 'node:fs'

/**
 * Checks if Tailwind is a dependency in the package.json file.
 */
function checkPackageJson(path) {
  if (existsSync(path)) {
    const packageJson = JSON.parse(readFileSync(path, 'utf-8'))
    const deps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    }
    if (deps.tailwindcss || deps['@nuxtjs/tailwindcss']) {
      return true
    }
  }
  return false
}

/**
 * Checks if Tailwind is installed in the project's dependencies.
 */
 function isTailwindInstalled() {
  try {
    const packages = globSync(['**/package.json'], { exclude: ['**/node_modules/**', '**/dist/**']})
     for (const pkg of packages) {
        if (checkPackageJson(pkg)) {
          return true;
        }
      }
  } catch {
    return false
  }
  return false
}

/**
 * Dynamically loads Prettier plugins based on project dependencies.
 */
export function loadPrettierPlugins() {
  const plugins = []
  if (isTailwindInstalled()) {
    plugins.push('prettier-plugin-tailwindcss')
  }
  return plugins
}
