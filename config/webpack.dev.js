const path = require("path")// nodejs核心模块  处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require("os")
// const TerserWebpackPlugin = require("terser-webpack-plugin")

const threads = os.cpus.length;  // cpu 核数

module.exports = {
   // 入口
   entry: './src/main.js',  // 相对路径
   // 输出
   output: {
      // 所有文件输出路径
      // 开发模式没有输出  所以不需要配置path
      path: undefined,  // 绝对路径
      // 入口文件输出的文件名
      filename: "js/[name].js",
      assetModuleFilename:"static/images/[hash:10][ext][query]",
      // 自动清空上次打包结果  原理：将 path=path.resolve(__dirname, 'dist') 整个目录清空 再打包
      clean: true,
   },
   // 加载器
   module: {
      rules: [
         {
            oneOf: [    // 每个文件只能被一个loader处理
               // 处理 样式的 loader
               {
                  test: /\.css$/,
                  use: [ // use 执行顺序 从右到左  先执行 css-loader  再执行 style-loader
                     'style-loader',   // 将js中的css通过创建style标签添加到html文件中生效
                     'css-loader'  // 将样式编译成 commonjs 模块到js中
                  ]
               },
               {
                  test: /\.less$/,
                  use: [
                     "style-loader",
                     "css-loader",
                     "less-loader"
                  ]
               },
               {
                  test: /\.s[ac]ss$/,
                  use: [
                     "style-loader",
                     "css-loader",
                     "sass-loader"
                  ]
               },
               {
                  test: /\.styl$/,
                  use: [
                     "style-loader",
                     "css-loader",
                     "stylus-loader"
                  ]
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
                  // generator: {
                  //    // filename: "static/media/[hash:10][ext][query]"
                  // }
               },
               // 使用babel处理js语言  preset babel 预设
               {
                  test: /\.js$/,
                  // exclude: /(node_modules|bower_components)/,  // 排除这些文件不处理
                  include: path.resolve(__dirname, "../src"),   // 只处理src目录下文件
                  use: [
                     {
                        loader: "thread-loader",
                        options: {
                           works: threads
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
                           plugins:[
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
      //    cache: true,
      //    cacheLocation: path.resolve(__dirname, "../node_modules/.cache/cacheDevEslint"),
      //    threads,
      // }),
      new HtmlWebpackPlugin({
         // title: 'HtmlWebpackPluginTitle',
         // 创建以  "public/index.html"  为模板的新的html文件
         // 新文件特点  1. 结构和之前一致    2. 自动引入打包资源
         template: path.resolve(__dirname, "../public/index.html")
      })
   ],
   // webpack-dev-server配置
   devServer: {
      host: 'localhost',
      port: '3000',
      open: true,  // 自动打开浏览器
      hot: true
   },
   // 打包模式
   mode: "development",   // 开发模式
   devtool: "cheap-module-source-map"
}