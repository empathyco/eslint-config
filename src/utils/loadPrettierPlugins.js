import { existsSync, readFileSync } from 'node:fs'

import fg from 'fast-glob'

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
async function isTailwindInstalled() {
  try {
    const packageFiles = await fg(['**/package.json', '!**/node_modules/**', '!**/dist/**'])

    for (const pkg of packageFiles) {
      if (checkPackageJson(pkg)) {
        return true
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
export async function loadPrettierPlugins() {
  const plugins = []
  if (await isTailwindInstalled()) {
    plugins.push('prettier-plugin-tailwindcss')
  }
  return plugins
}
