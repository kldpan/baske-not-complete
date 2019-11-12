import axios from "axios";

// 下面是做一个生产环境和开发环境都能访问做的兼容，如果匹配到.com,则是生产环境（打包上线环境），匹配一个空串''替代apis，如果没.com,则是开发环境，此时需要匹配一个'/apis'

// var baseURL = localhost.host.indexOf(".com") !== -1 ? "" : "/apis";           //开发环境

var baseURL = "http://m.bestcake.com";         //生产环境

var instance = axios.create({
  baseURL,
  timeout: 10000,
  transformRequest: [
    function(data) {
      // 对 data 进行任意转换处理
      // 在请求发出之前 ajax 传入参数
      // JSON.stringify()
    

      return data;
    }
  ],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    function(data) {
      // 对 data 进行任意转换处理

      return data;
    }
  ],

  //设置返回数据类型
  responseType: 'json'
});

// 什么是拦截器  项目里面所有的请求发送前
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //打开loading

    // config.headers.token="xxxxxxsalkfhsdjkfh"
    // 加入一些通用配置 通用参数
    // console.log(config)

    return config;
  }, function (error) {
    // 对请求错误做些什么
    
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response)
    //关闭loading
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default instance;   //类似  $.ajax




/*
instance({
    method:"get",
    url:"/1.jpg",
    设置返回数据类型
    headers:{
        content-type:json
    }
    responseType: 'blob'
    data:{

    }
})

instance.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
  }));
*/ 
