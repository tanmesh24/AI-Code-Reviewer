export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapping: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/setupTests.js",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx}",
  ],
  verbose: true,
};
