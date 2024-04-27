const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({

  e2e: {
    baseUrl: "https://en.wikipedia.org",
    setupNodeEvents(on, config) {
      allureCypress(on, {
        resultsDir: "./allure-results",
      });
      return config;
    },
    screenshotOnRunFailure: true,
    video: true,
    videoCompression: false,
    videosFolder: 'cypress/videos'
  },
});
