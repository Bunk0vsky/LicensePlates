const path = require("path");

module.exports = {
  entry: "./index.html",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.html",
  },
};
