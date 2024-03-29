// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RokuCharts',
      // the proper extensions will be added
      fileName: 'roku-charts',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['d3'],
      output: {
        // Provide global variables to use in the UMD build
        name: 'RokuCharts',
        globals: {
          d3: 'd3'
        }
      },
    },
  },
  plugins: [dts({
    outDir: 'dist/types',
    include: ['src/**/*.ts'],
  })],
})
