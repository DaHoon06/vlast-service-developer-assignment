import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
    dir: './',
});

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ['node_modules/(?!(date-fns)/)'],
    modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/dist/'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    coverageThreshold: {
        global: { branches: 0, functions: 0, lines: 0, statements: 0 },
    },
};

export default createJestConfig(config);
