const path = require('path');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require("webpack")
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

const isProduction = process.env.NODE_ENV === "production";

// ** 返回处理样式的loader函数
const getStyleLoaders = (loaderType) => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
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
    loaderType
  ].filter(Boolean);
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",
    chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js",
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
        loader: 'vue-loader',
        options: {
          // 开启缓存
          cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/vue-loader')
        }
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
    isProduction && new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:10].css',
      chunkFilename: 'static/css/[name].[contenthash:10].chunk.css',
    }),
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    // cross-env 定义的环境变量是给打包工具使用
    // ** DefinePlugin 定义的环境变量给源代码使用， 从而解决vue3页面警告的问题
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    // 按需加载element_plus
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
  ].filter(Boolean),
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vue: {
          test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
          name: "vue-chunk",
          priority: 40,
        },
        elementPlus: {
          test: /[\\/]node_modules[\\/]element-plus(.*)?[\\/]/,
          name: "element-chunk",
          priority: 30,
        },
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: "libs-chunk",
          priority: 20,
        },
      }
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
    minimize: isProduction,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  // webpack 解析模块加载选项
  resolve: {
    // 自动补全文件扩展名
    extensions: [".vue", ".js", ".json"],
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  devServer: {
    host: 'localhost',
    port: 8888,
    open: true,
    hot: true,
  },
  performance: false,
};

