var path = require("path");
var webpack = require("webpack");
function resolve(dir) {
  return path.join(__dirname, dir);
}

// http://m.bestcake.com/json1811.ashx?v=1572839103341&c=NewIndexController&m=index

module.exports = {
  publicPath: "./",
  devServer: {
    host: "0.0.0.0",
    port: 8899,
    proxy: {
      "/apis": {
        target: "http://m.bestcake.com",
        changeOrigin: true,
        pathRewrite: {
          "^/apis": ""
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set("@", resolve("src"));
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import "~@/assets/css/index.scss";	
       `
      }
    }
  }
};
