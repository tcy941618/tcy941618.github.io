const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = {
  // 模式，可选development、production、none，none表示不做任何默认处理
  mode: 'none',
  // 入口
  entry: {
    app: './src/index.js'
  },
  // 输出文件
  output: {
    // 文件名
    filename: 'js/[name].[chunkhash:8].js',
    //
    chunkFilename: 'js/[name].[chunkhash:8].js',
    // 在index.html的script中写入的路径，一般用于生产环境构建时写入js、css等文件将要发布到的静态服务器/CDN地址
    publicPath: 'http://www.baidu.com',
    // 构建地址，指写入本地磁盘的哪个文件夹
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: path.resolve(__dirname, 'dist/css')
              // hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'test'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      // filename: 'css/[name].[chunkhash:8].css',
      chunkFilename: 'css/[name].[chunkhash:8].css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),
    // 生成minifest文件
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      generate: (seed, files) => {
        const manifestFiles = files.reduce(function(manifest, file) {
          manifest[file.name] = file.path
          return manifest
        }, seed)

        return {
          files: manifestFiles
        }
      }
    })
  ],
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      })
    ],
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      name: false
    },
    moduleIds: 'hashed'
  }
}
