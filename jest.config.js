const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
        "^@/components/(.*)$": "<rootDir>/components/$1",
    },
};

module.exports = createJestConfig(customJestConfig);
