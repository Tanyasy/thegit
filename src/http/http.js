import axios from "axios";
import router from "../router"
import {ElMessage} from "element-plus";


//创建axios的一个实例
var instance = axios.create({
    baseURL:'http://127.0.0.1:8080/api/v1/',//接口统一域名
    timeout: 6000                                                       //设置超时
})
// 请求拦截器
instance.interceptors.request.use(function (config) {
    // 拦截请求，添加token
    const token = sessionStorage.getItem("token")
    if (token) {
        config.headers.Authorization = "Bearer " + token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(function (response) {

    return response.data;
}, function (error) {
    // 拦截403请求，说明session失效，跳转到login界面
    if (401 === error.response.status) {
        router.push("/login")
    } else if (403 === error.response.status) {
        ElMessage.error({
            message: "抱歉，无权限访问",
            type: "error"
        })
    }
    return Promise.reject(error);
});

/**
 * 使用es6的export default导出了一个函数，导出的函数代替axios去帮我们请求数据，
 * 函数的参数及返回值如下：
 * @param {String} method  请求的方法：get、post、delete、put
 * @param {String} url     请求的url:
 * @param {Object} data    请求的参数
 * @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
 */
export default function (method, url, data = null) {
    method = method.toLowerCase();
    if (method == 'post') {
        return instance.post(url, data)
    } else if (method == 'get') {
        return instance.get(url, { params: data })
    } else if (method == 'delete') {
        return instance.delete(url, { params: data })
    }else if(method == 'put'){
        return instance.put(url,data)
    }else{
        console.error('未知的method'+method)
        return false
    }
}