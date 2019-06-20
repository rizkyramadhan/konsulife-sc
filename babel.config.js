module.exports = function (api) {
  api.cache.forever();

  const presets = [["module:metro-react-native-babel-preset"]];

  const plugins = [
    ["@babel/proposal-decorators", { legacy: true }],
    [
      "module-resolver",
      {
        alias: {
          "@app": "./src",
          "@icon": "./src/assets/icon"
        }
      }
    ]
  ];

  if (process.env.platform === "web") {
    return {
      presets: ["@babel/env", ...presets],
      plugins
    };
  }

  return { presets, plugins };
};
