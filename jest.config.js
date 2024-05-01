module.exports = {
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  modulePaths: ["<rootDir>"],
};
