const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,

  use: {
    baseURL: 'http://localhost:8081',
    headless: false,

    // Use browser window size
    viewport: null,

    launchOptions: {
      args: ['--start-maximized'],
    },

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        channel: 'chrome',
      },
    },
  ],

  reporter: [
    ['html'],
    ['list'],
  ],
});