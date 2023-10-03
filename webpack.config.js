const path = require("path");

module.exports = {
  entry: "./src/index.html",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    assetModuleFilename: "[path][name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.html$/, // Reguła dla plików HTML
        use: ["html-loader"], // Loader do obsługi plików HTML
      },
      {
        test: /\.css$/, // Reguła dla plików CSS
        use: ["style-loader", "css-loader"], // Loadery do obsługi plików CSS
      },
      {
        test: /\.js$/, // Reguła dla plików JavaScript
        exclude: /node_modules/, // Wyklucz pliki z katalogu node_modules
        use: {
          loader: "babel-loader", // Loader do obsługi plików JavaScript
          options: {
            presets: ["@babel/preset-env"], // Konfiguracja Babel (opcjonalna)
          },
        },
      },
    ],
  },
};
