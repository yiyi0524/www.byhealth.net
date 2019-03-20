module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        //这个配置无效
        root: ["./src/"],
        alias: {
          "@": "./src",
          "@routes": "./src/routes",
          "@config": "./src/config",
          "@utils": "./src/utils",
          "@pages": "./src/pages",
          "@components": "./src/components",
          "@styles": "./src/assets/styles",
          "@img": "./src/assets/images",
          "@api": "./src/services",
          "@redux": "./src/redux",
        },
      },
    ],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
  ],
};
