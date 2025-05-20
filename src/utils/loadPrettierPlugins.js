import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

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
}

/**
 * Checks if Tailwind is installed in the project's dependencies.
 */
function isTailwindInstalled() {
  try {
    // Check the root package.json first
    const rootPackageJsonPath = resolve(process.cwd(), 'package.json')

    if (checkPackageJson(rootPackageJsonPath)) {
      return true
    }

    // Check for a packages directory, which is common in monorepos
    const packagesDir = resolve(process.cwd(), 'packages')

    if (existsSync(packagesDir)) {
      // Check each package in the packages directory
      try {
        const packages = readdirSync(packagesDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

        for (const pkg of packages) {
          const packageJsonPath = resolve(packagesDir, pkg, 'package.json')

          if (checkPackageJson(packageJsonPath)) {
            return true
          }
        }
      } catch {
        // If there's an error reading the packages directory, continue
      }
    }

    return false
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
