import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/**/*.test.{ts,tsx}'],
        coverage: {
            include: ['src/**/*.{ts,tsx}'],
        },
    },
});
