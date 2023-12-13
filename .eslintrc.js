module.exports = {
   // 继承eslint官网规则
   extends: ["eslint:recommended"],
   // 环境变量
   env: {
      node: true, // 启用node全局变量
      browser: true // 启用浏览器中全局变量
   },
   // 语法环境
   parserOptions: {
      ecmaVersion: 6,  // es6
      sourceType: "module",  // es module
   },
   rules: {
      "no-var": 2,  // 不能使用var 声明变量  否则警告
   },
   plugins:["import"],
}