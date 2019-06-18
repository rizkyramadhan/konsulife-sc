const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const { buildConfig, APP_PATH, WEB_PATH } = require("./common");

module.exports = (env, argv) =>
  merge(buildConfig(env, argv), {
    entry: path.join(WEB_PATH, "index.hmr.js"),
    devtool: "inline-source-map",

    output: {
      publicPath: "/"
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],

    devServer: {
      contentBase: APP_PATH,
      historyApiFallback: {
        index: "/"
      },
      openPage: "",
      inline: true,
      stats: "minimal",
      open: true,
      port: 9999,
      hot: true
    }
  });
