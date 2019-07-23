var path = require("path");
var webpack = require("webpack");

module.exports = {
  dev: {
    entry: path.resolve(__dirname, "/examples/main.js"),
    mode: "development",
    port: 8090,
    output: {
      path: path.resolve(__dirname, "/examples/dist/demo-dist.js"),
      filename: "demo-dist.js"
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    }
  },
  build: {
    entry: "./src/lib/index.js",
    output: {
      path: path.resolve(__dirname, "./dist"),
      publicPath: "/dist/",
      filename: "el-validate-table.js",
      library: "ElValidateTable",
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["vue-style-loader", "css-loader"]
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
          options: {
            loaders: {}
            // other vue-loader options go here
          }
        },
        {
          test: /\.sass$/,
          use: ["vue-style-loader", "css-loader", "sass-loader?indentedSyntax"]
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]?[hash]"
          }
        }
      ]
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js"
      },
      extensions: ["*", ".js", ".vue", ".json"]
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true
    },
    performance: {
      hints: false
    },
    devtool: "#eval-source-map"
  },

};

if (process.env.NODE_ENV === "production") {
  config.devtool = "#source-map";
  config.plugins = (config.plugins  || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      mangle: true,
      compress: {
        warnings: false
      }
    })
    
  ]);
}

module.exports = config;
