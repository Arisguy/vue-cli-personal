const path = require('path')
const EslintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require("webpack")

// ** 返回处理样式的loader函数
const getStyleLoaders = (loaderType) => {
  return [
    "vue-style-loader",
    "css-loader",
    {
      // ** 处理样式的兼容问题
      // ?? 需要配合package.json中的browserslist来指定兼容性
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        }
      }
    },
    loaderType,
  ].filter(Boolean);
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: undefined,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
  },
  module: {
    rules: [
      // Todo 处理css
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("styuls-loader")
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // Todo 处理图片
      {
        test: /\.(jpe?g|png|git|webp|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          }
        }
      },

      // Todo 处理其他资源
      {
        test: /\.(woff?|ttf)$/,
        type: 'asset/resource',
      },

      // Todo 处理js
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        }
      }
    ]
  },

  // Todo 处理html
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    // cross-env 定义的环境变量是给打包工具使用
    // ** DefinePlugin 定义的环境变量给源代码使用， 从而解决vue3页面警告的问题
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
  ],
  mode: 'development',
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
  },
  // webpack 解析模块加载选项
  resolve: {
    extensions: [".vue", ".js", ".json"]
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    open: true,
    hot: true, // 开启HMR
    historyApiFallback: true, // 解决前端路由刷新404问题
  },
};

