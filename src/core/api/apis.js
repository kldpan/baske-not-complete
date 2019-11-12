import request from "./http"  // request({})
import params from "./params"

// var poxy = "/apis";       //开发环境
var poxy = "";            //生产环境
var url1="/json1811.ashx"
var url2="/user/topic"

class Apis {
    // 获取首页数据的axios
    // 首页数据接口http://m.bestcake.com/json1811.ashx?v=1572839103341&c=NewIndexController&m=index
    getIndexData(){
       return request({
            method:"GET",
            url:poxy + url1,
            params:{
                c : 'NewIndexController',
                m : 'index',
                v : params.v
            }
        })
    }

    // 获取分类页数据的axios

    // 分类页数据接口http://m.bestcake.com/json1811.ashx?v=1572931057768&c=NsCakeCenter&m=GetJdListNew

    getListData(){
        return request({
             method:"GET",
             url:poxy + url1,
             params:{
                 c : 'NsCakeCenter',
                 m : 'GetJdListNew',
                 v : params.v
             }
         })
     }

    //  获取详情页数据的axios（两个axios）

    // 详情页数据第一种接口http://m.bestcake.com/json1811.ashx?Name=%E4%B8%80%E8%A7%81%E5%80%BE%E5%BF%83&c=NsCakeCenter&m=GetNSCakeByName&v=1573020118046

    getShowDataOne(data){
        return request({
            method:'GET',
            url:poxy + url1,
            params:{
                Name:data.Name,
                c:'NsCakeCenter',
                m:data.m,
                v:params.v
            }
        })
    }

    // 详情页数据第二种接口http://m.bestcake.com/json1811.ashx?City=%E4%B8%8A%E6%B5%B7&ProName=%E9%87%91%E8%A3%85%E4%BA%91%E9%A1%B6%E6%9B%B2%E5%A5%87&c=IndexCenter&m=GetjzCakeInfo&v=1573020560389

    getShowDataTwo(data){
        return request({
            method:'GET',
            url:poxy + url1,
            params:{
                City:data.City,
                ProName:data.ProName,
                c:data.c,
                m:data.m,
                v:params.v
            }
        })
    }

}

export default new Apis();  //{getTest:function(){}}