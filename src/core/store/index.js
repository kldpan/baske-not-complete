import Vue from "vue";
import Vuex from "vuex";
import  apis from "@/core/api/apis"

Vue.use(Vuex);       //use后可全局this.$store.state调用

export default new Vuex.Store({
  state: {     //全局属性变量  data
    City:'上海',
    cartList:[],
  },
  mutations:{

    // 思路：加入购物车有两种
    // 一种是列表页点击商品购买加入购物车
    // 点击后将该商品id,品名，图，size，价格5条数据先存入vuex中
    // 一种是商品详情页点击加入购物车按钮加入购物车
    // 点击后将商品id，品名，图，size,价格，数量6条数据（其中图带list在参数中传到show页的图）存入vuex中

    // vuex中存商品数据时，有两种情况
    // 一种是vuex中彻底无数据，则新增即可
    // 一种是vuex中有数据，需通过商品ID判断此时添加的商品是否在vuex中已经存在，如果不存在，则新增即可，如果存在，则不再新增，而是将已存在vuex中的数据的num更新即可

    getCartInfo(state,data){
      // 先声明一个控制开关
      var flag = true;
      // console.log(data)
      // 第二种————cartList有数据
      // 如果cartList中有数据，则先遍历cartList，并通过商品的ID值判断是否有该商品
      state.cartList.map((item,index) => {
        if(item.ID === data.ID){
          // 此时又有两种情况
          // 详情页商品带过来num大于1，则vuex中的num+=带过来的num,关闭开关不让该商品数据新增入vuex,否则vuex中的num++,也关闭开关
          if(item.num > 1){
            item.num = item.num + data.num;
            flag = false;
          }else{
            item.num++;
            flag = false;
          }
          
        }
      })


      // 第一种————新增数据
      // 如果cartList中无任何数据，将点击的商品数据新增到cartList中，如果是list带过来的数据，无num字段，则新增num字段，并赋值为1，如果是show带过来的数据，有num字段，则用该带过来的num即可
      if(flag){
        data.num = data.num || 1;
        state.cartList.push(data);
        
      }
    }
  },
  getters:{
    

  },
  actions:{
     
  }


})
