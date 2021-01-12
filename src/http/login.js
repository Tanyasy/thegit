import req from './http.js';                 //连接接口文件
export const login=function(e){
   return req('post','/user',{qwe:e})    //post方法以及传参    qwe是字段   e是参数
}
