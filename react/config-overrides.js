const { override, fixBabelImports, addWebpackAlias } = require("customize-cra");
const path = require("path");
module.exports = override(
  fixBabelImports("antd", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css"
  }),
  fixBabelImports("antd-mobile", {
    libraryName: "antd-mobile",
    libraryDirectory: "es",
    style: "css"
  }),
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src"),
    ["@api"]: path.resolve(__dirname, "src/services"),
    ["@utils"]: path.resolve(__dirname, "src/utils"),
    ["@assets"]: path.resolve(__dirname, "src/assets"),
    ["@components"]: path.resolve(__dirname, "src/components"),
    ["@pages"]: path.resolve(__dirname, "src/pages"),
    ["@redux"]: path.resolve(__dirname, "src/redux"),
    ["@img"]: path.resolve(__dirname, "src/assets/images"),
    ["@sass"]: path.resolve(__dirname, "src/assets/sass")
  })
);
