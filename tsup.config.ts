import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  clean: true,
  outDir: 'build',
})
