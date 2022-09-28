const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const Copy = require("copy-webpack-plugin");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  resolve: {
    extensions: [".ts"],
  },
  target: "node",
  externals: [nodeExternals()],
  plugins: [
    new Copy({
      patterns: [{ from: "prisma", to: "prisma" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loader: "ts-loader",
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".serverless"),
            path.resolve(__dirname, ".webpack"),
          ],
        ],
      },
    ],
  },
};
