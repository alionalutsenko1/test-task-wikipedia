const { defineConfig } = require("cypress");

module.exports = defineConfig({
  
  e2e: {
    baseUrl: "https://en.wikipedia.org",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
