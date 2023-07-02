module.exports = {
  sets: {
    desktop: {
      files: "test/hermione/*.hermione.js",
    },
  },

  browsers: {
    chrome: {
      automationProtocol: "devtools",
      desiredCapabilities: {
        browserName: "chrome",
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
    },
  },
};
