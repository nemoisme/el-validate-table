const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const env = process.env.NODE_ENV
const isPrd = env === 'production'

const devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: './index.html',
    inject: 'body',
    minify: {
      removeComments: true
    }
  })
]


module.exports = {
  //输入
  mode: env,
  entry: {
    path: !isPrd ? path.join(__dirname, './examples/main.js') : path.join(__dirname, './packages/index.js'),
  },
  //输出
  output: {
    path: path.resolve(__dirname, isPrd ? './lib' : './dist'),
    filename: isPrd ? 'el-validate-table.js' : 'bundle.js',
    library: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/element-ui/src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'style-loader', 'css-loader']
      }
    ]
  },
  // optimization:{
  //   minimizer:isPrd,
  // },
  plugins: [new VueLoaderPlugin()].concat(isPrd ? [] : devPlugins),
  devServer: {
    port: 3000,
    host: '127.0.0.1',
    open: true,
    hot: true,
    overlay: { erros: true }
  }
}

