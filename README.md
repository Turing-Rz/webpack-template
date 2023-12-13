# webpack 5大核心概念
```js
/**
 * 
1. entry 入口
   -- 打包入口
2. output 输出
   -- 打包后文件输出位置
3. loader 加载器
   -- webpack本身只能处理js、json等  所以其他资源需要借助loader
4. plugins 插件
   -- 扩展webpack功能
5. mode 模式
   -- 主要两种模式
      · 开发模式 development
      · 生产模式 production
 */

```

# 总结
1. 提升开发体验
   · 使用`source map`让开发或者上线时能准确定位代码报错位置
   · 开发模式可以使用`cheap-module-source-map`
   · 生产模式可以使用`source-map`

2. 提升webpack打包速度
   · 使用`HotModuleReplacement`让开发时重新编译打包更新变化了的代码，不变的代码使用缓存。从而使跟新速度更快
   ·  使用`oneOf`loader处理资源的时候只要被处理了就不继续遍历
   ·  使用`include、exclude`只检测或者排除某些文件
   ·  使用`Cache`对 Eslint和babel处理的结果进行缓存，让二次打包速度更快
   ·  使用`Thead`多进程处理eslint和babel任务。但是每次开启进程都有开销

3. 减少代码体积
   · 使用`Tree Shaking`剔除没有使用的多余代码
   · 使用`@babel/plugin-transform-runtime`插件对babel进行处理，让辅助代码从中引入，二不是每个文件都生成辅助代码
   · 使用`Image Minimizer`对项目图片进行压缩（如果图片是线上链接，就不需要了）

4. 优化代码运行性能
   · 使用`code split`对代码分割成多个j文件，并通过import动态导入语句进行按需加载。
   · 使用`preload/prefetch`对代码进行提前加载，需要注意的时这两个用法兼容性不是很好，`preload`对IE浏览器完全不兼容，但是浏览器适配率在97%左右，`prefetch`适配率70%左右
   · 使用`NetWork cache`对输出文件更好的重命名，方便做缓存
   · 使用`corejs`对js代码进行兼容性处理
   · 使用`PWA`让代码也能离线访问，使用webpack的`workebox`插件。