module.exports = {
   presets: [
      ["@babel/preset-env", { 
         useBuiltIns: 'usage', // 按需加载 智能引入
         corejs: { version:3 },
      }] // 智能预设  编译ES6语法
   ],
}