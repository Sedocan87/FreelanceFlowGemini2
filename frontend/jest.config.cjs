module.exports = {
    testEnvironment: 'jest-environment-jsdom-global',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
        '^../api$': '<rootDir>/src/__mocks__/api.js',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
};
