import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/controllers/**', 'src/models/**']
    }
  }
});
