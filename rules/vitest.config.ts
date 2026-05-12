import { defineConfig } from 'vitest/config'

// @gamepark/rules-api ships ESM with directory imports that Node's strict
// resolver rejects. Inlining it forces Vite's resolver to handle the package,
// which understands those imports.
export default defineConfig({
  test: {
    server: {
      deps: {
        inline: [/@gamepark\//]
      }
    }
  }
})
