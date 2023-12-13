// 完整引入 core.js
// import "core-js"
// 按需加载
// import "core-js/es/promise"


import count from "./js/count";
import sum from "./js/sum";

import "./css/index.css"
import "./less/index.less"
import "./sass/index.sass"
import "./stylus/index.styl"
import "./css/iconfont.css"
// import { include } from "@vue/preload-webpack-plugin/src/lib/default-options";

// console.log(mul(5, 5));
document.getElementById('btn').onclick = function () {
   // eslint 不能识别动态导入语法
   import(/* webpackChunkName: "math" */'./js/math').then(({ mul }) => {
      console.log("按需加载", mul(4, 6));
   }).catch((err) => {
      console.log(err);
   })
}
console.log(count(1, 3));
console.log(sum(1, 2, 3, 4));


new Promise((resolve, reject) => {
   setTimeout(() => {
      console.log("异步执行");
      resolve("异步执行")
   }, 1000);
})

const arr = [1, 2, 3, 4]
console.log(arr.includes(1));

if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
         console.log('SW registered: ', registration);
      }).catch(registrationError => {
         console.log('SW registration failed: ', registrationError);
      });
   });
}else{
   console.log("222222");
}