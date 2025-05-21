// These imports are only for type information
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { loadPrettierPlugins } from './loadPrettierPlugins'

const existsSyncMock = vi.hoisted(() => vi.fn())
const readFileSyncMock = vi.hoisted(() => vi.fn())
const readdirSyncMock = vi.hoisted(() => vi.fn())

// Mock the fs and process modules
vi.mock('node:fs', () => ({
  existsSync: existsSyncMock,
  readFileSync: readFileSyncMock,
  readdirSync: readdirSyncMock,
}))

vi.mock('node:path', () => ({
  resolve: vi.fn((...args) => args.join('/')),
  join: vi.fn((...args) => args.join('/')),
}))

describe('loadPrettierPlugins', () => {
  // eslint-disable-next-line ts/no-unsafe-assignment
  const originalCwd = process.cwd

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks()

    // Mock process.cwd to return a fixed path
    process.cwd = vi.fn().mockReturnValue('/fake/project/path')

    // Default mock for existsSync to return false
    vi.mocked(existsSyncMock).mockReturnValue(false)
  })

  afterEach(() => {
    // Restore original process.cwd
    process.cwd = originalCwd
  })

  it('should return an empty array when Tailwind is not installed', () => {
    // Mock package.json to not have Tailwind
    vi.mocked(existsSyncMock).mockReturnValueOnce(true) // package.json exists
    vi.mocked(readFileSyncMock).mockReturnValueOnce(
      JSON.stringify({
        dependencies: {},
        devDependencies: {},
      }),
    )

    const plugins = loadPrettierPlugins()
    expect(plugins).toEqual([])
  })

  it('should include Tailwind plugin when Tailwind is in dependencies', () => {
    // Mock package.json to have Tailwind in dependencies
    vi.mocked(existsSyncMock).mockReturnValueOnce(true) // package.json exists
    vi.mocked(readFileSyncMock).mockReturnValueOnce(
      JSON.stringify({
        dependencies: {
          tailwindcss: '^3.0.0',
        },
      }),
    )

    const plugins = loadPrettierPlugins()

    expect(plugins).toContain('prettier-plugin-tailwindcss')
  })

  it('should include Tailwind plugin when Tailwind is in devDependencies', () => {
    // Mock package.json to have Tailwind in devDependencies
    vi.mocked(existsSyncMock).mockReturnValueOnce(true) // package.json exists
    vi.mocked(readFileSyncMock).mockReturnValueOnce(
      JSON.stringify({
        devDependencies: {
          tailwindcss: '^3.0.0',
        },
      }),
    )

    const plugins = loadPrettierPlugins()
    expect(plugins).toContain('prettier-plugin-tailwindcss')
  })

  it('should include Tailwind plugin when Nuxt Tailwind is installed', () => {
    // Mock package.json to have @nuxtjs/tailwindcss
    vi.mocked(existsSyncMock).mockReturnValueOnce(true) // package.json exists
    vi.mocked(readFileSyncMock).mockReturnValueOnce(
      JSON.stringify({
        devDependencies: {
          '@nuxtjs/tailwindcss': '^1.0.0',
        },
      }),
    )

    const plugins = loadPrettierPlugins()
    expect(plugins).toContain('prettier-plugin-tailwindcss')
  })

  it('should check packages in a monorepo structure', () => {
    // Mock root package.json without Tailwind
    vi.mocked(existsSyncMock).mockReturnValueOnce(true) // Root package.json exists
    vi.mocked(readFileSyncMock).mockReturnValueOnce(
      JSON.stringify({
        dependencies: {},
        devDependencies: {},
      }),
    )

    // Mock packages directory exists
    vi.mocked(existsSyncMock).mockReturnValueOnce(true)

    // Mock readdirSync to return a list of packages
    vi.mocked(readdirSyncMock).mockReturnValueOnce([
      { name: 'package-a', isDirectory: () => true },
      { name: 'package-b', isDirectory: () => true },
    ] as any)

    // Mock package-a's package.json without Tailwind
    vi.mocked(existsSyncMock).mockReturnValueOnce(true)
    vi.mocked(readFileSyncMock).mockReturnValueOnce(
      JSON.stringify({
        dependencies: {},
        devDependencies: {},
      }),
    )

    // Mock package-b's package.json with Tailwind
    vi.mocked(existsSyncMock).mockReturnValueOnce(true)
    vi.mocked(readFileSyncMock).mockReturnValueOnce(
      JSON.stringify({
        dependencies: {
          tailwindcss: '^3.0.0',
        },
      }),
    )

    const plugins = loadPrettierPlugins()
    expect(plugins).toContain('prettier-plugin-tailwindcss')
  })
})
