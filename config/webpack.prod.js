const path = require("path")// nodejs核心模块  处理路径问题
const os = require("os")
// const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin")
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// const { extendDefaultPlugins } = require("svgo");

const threads = os.cpus.length;  // cpu 核数

// 获取处理样式的loader
function getStyleLoader(pre) {
   return [
      MiniCssExtractPlugin.loader,   // 将js中的css通过创建style标签添加到html文件中生效
      'css-loader',  // 将样式编译成 commonjs 模块到js中
      {
         loader: 'postcss-loader',
         options: {
            postcssOptions: {
               plugins: [
                  'postcss-preset-env'
               ]
            }
         }
      },
      pre
   ].filter(Boolean)
}

module.exports = {
   // 入口
   entry: './src/main.js',  // 相对路径
   // 输出
   output: {
      // 所有文件输出路径
      path: path.resolve(__dirname, '../dist'),  // 绝对路径
      // 入口文件输出的文件名
      filename: "js/[name].[contenthash:10].js",
      chunkFilename: "static/js/[name].chunk.[contenthash:10].js",  // 打包继承的文件名
      assetModuleFilename: "static/media/[hash:10][ext][query]",  // 图片字体等通过type：asset处理的资源
      // 自动清空上次打包结果  原理：将 path=path.resolve(__dirname, 'dist') 整个目录清空 再打包
      clean: true,
   },
   // 加载器
   module: {
      rules: [
         {
            oneOf: [
               // 处理 样式的 loader
               {
                  test: /\.css$/,
                  use: getStyleLoader()
               },
               {
                  test: /\.less$/,
                  use: getStyleLoader("less-loader")
               },
               {
                  test: /\.s[ac]ss$/,
                  use: getStyleLoader("sass-loader")
               },
               {
                  test: /\.styl$/,
                  use: getStyleLoader("stylus-loader")
               },
               // 处理图片资源  不配置parser 默认所有图片都转化为base64格式
               {
                  test: /\.(png|jpe?g|gif|webp|svg)$/,
                  type: "asset",  // 会转base64
                  parser: {
                     dataUrlCondition: {
                        // 优点：减少请求数量   缺点：图片体积变大一点
                        maxSize: 10 * 1024 // 小于10kb的图片转base64
                     }
                  },
                  generator: {
                     // 输出图片的文件目录
                     // hash 哈希值 文件的id  hash:10  标示hash值只取前10位
                     // ext  文件扩展命
                     // query  携带的参数
                     // filename: 'static/images/[hash:10][ext][query]'
                  }
               },
               // 字体文件打包  以及 其他资源
               {
                  test: /.(woff2?|ttf|mp3|mp4|avi)$/,
                  type: "asset/resource", // 不会转base64
                  generator: {
                     // filename: "static/media/[hash:10][ext][query]"
                  }
               },
               // 使用babel处理js语言  preset babel 预设
               {
                  test: /\.js$/,
                  exclude: /(node_modules|bower_components)/,  // 排除这些文件不处理
                  use: [
                     {
                        // 开启多进程
                        loader: "thread-loader",
                        options: {
                           works: threads,  // 进程数量
                        }
                     },
                     {
                        loader: 'babel-loader',  // 只引入一个依赖 可以使用loader
                        // 在这里配置  或者 在 babel.config.js 文件中配置
                        // options:{
                        //    perset:['@babel/preset-env']
                        // }
                        options: {
                           cacheDirectory: true,  // 开启babel缓存
                           cacheCompression: false, // 开启文件压缩
                           plugins: [
                              "@babel/plugin-transform-runtime", // 减少代码体积
                           ]
                        }
                     }
                  ]
               }
            ]
         }
      ],
   },
   // 插件
   plugins: [
      // new ESLintPlugin({
      //    // 检测哪些文件
      //    context: path.resolve(__dirname, "../src"),
      //    exclude: "node_modules",
      //    cache: true,  // 开启缓存
      //    cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"), // 缓存路径
      //    threads, // 开启多进程 设置进程数量
      // }),
      new HtmlWebpackPlugin({
         // title: 'HtmlWebpackPluginTitle',
         // 创建以  "public/index.html"  为模板的新的html文件
         // 新文件特点  1. 结构和之前一致    2. 自动引入打包资源
         template: path.resolve(__dirname, "../public/index.html")
      }),
      new MiniCssExtractPlugin({
         filename: "static/css/[name].[contenthash:10].css",
         chunkFilename: "static/css/[name].chunk.[contenthash:10].css"
      }),  // mini-css 插件  将css文件单独打包
      // 压缩的配置可以放在 optimization 中
      // new CssMinimizerPlugin(),
      // new TerserWebpackPlugin({
      //    parallel: threads
      // })
      new PreloadWebpackPlugin({
         // rel: 'preload',
         // as: 'script'
         rel: 'prefetch'
      }),
      new WorkboxPlugin.GenerateSW({
         // 这些选项帮助快速启用 ServiceWorkers
         // 不允许遗留任何“旧的” ServiceWorkers
         clientsClaim: true,
         skipWaiting: true,
      }),
   ],
   optimization: {
      // 压缩操作
      minimizer: [
         new CssMinimizerPlugin(),  // 压缩css
         new TerserWebpackPlugin({  // 压缩JS
            parallel: threads
         }),
      ],
      // 代码分割
      splitChunks: {
         chunks: "all",
         // 其他的用默认值
      },
      // 
      runtimeChunk: {
         name: entrypoint => `runtime${entrypoint.name}`
      }
   },
   // 生产模式不需要 webpack-dev-server
   // 打包模式
   mode: "production",   // 生产模式
   devtool: "source-map"
}