import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

/**
 * Checks if Tailwind is installed in the project's dependencies.
 */
function isTailwindInstalled() {
  try {
    const packageJsonPath = resolve(process.cwd(), 'package.json')
    if (!existsSync(packageJsonPath)) return false

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    const deps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    }

    return Boolean(deps.tailwindcss || deps['@nuxtjs/tailwindcss'])
  } catch {
    return false
  }
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
