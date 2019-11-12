<template>
  <div>
    <!-- 第一层————类型 -->
    <div class="mallClass">
      <ul>
        <li @click="leftClick()" :class="{'mall':bool}">自营</li>
        <li @click="rightClick()" :class="{'mall':!bool}">贝式严选</li>
      </ul>
    </div>

    <!-- 第二层————根据不同类型，显示不同主题 -->
    <div class="theme" v-if="goodsList.length !== 0">
      <ul>
        <li v-for="(item,index) in goodsList" :key="index">
          <a href="#" @click="selectTheme(index)">{{item.theme}}</a>
        </li>
      </ul>
    </div>

    <!-- 第三层————主题下面的动画滑块 -->
    <div class="slideBox">
      <div class="slide"></div>
    </div>

    <!-- 第四层————商品 -->
    <div v-for="(item,index) in goods.list" :key="index" >
      <ul>
        <li>
          <img :src="item.ImgUrl" @click="toPath(item)"/>
          <h3>{{item.Name}}</h3>
          <h3>{{item.Means}}</h3>
          <span>￥{{item.CurrentPrice.toFixed(2)}}</span>
          <span>/{{item.LabelText}}</span>
          <button @click="toCart(item)">购买</button>
        </li>
      </ul>
    </div>
  
  
  
  </div>

<!-- 下面一堆和上面第4层效果一样
  <div v-if="it.SupplyNo.indexOf('NS') !== -1">
    <img :src="it.ImgUrl"/>
    <h3>{{it.Name}}</h3>
    <h3>{{it.Means}}</h3>
    <span>￥{{it.CurrentPrice.toFixed(2)}}</span>
    <span>/{{it.LabelText}}</span>
  </div>
  <div v-if="it.SupplyNo.indexOf('KSK') !== -1">
    <img :src="it.ImgUrl"/>
    <h3>{{it.Name}}</h3>
    <h3>{{it.Means}}</h3>
    <span>￥{{it.CurrentPrice.toFixed(2)}}</span>
    <span>/{{it.LabelText}}</span>
  </div>
  <div v-if="it.SupplyNo.indexOf('JZ') !== -1">
    <img :src="it.ImgUrl"/>
    <h3>{{it.Name}}</h3>
    <h3>{{it.Means}}</h3>
    <span>￥{{it.CurrentPrice.toFixed(2)}}</span>
    <span>/{{it.LabelText}}</span>
  </div>
  <div v-if="it.SupplyNo.indexOf('RP') !== -1">
    <img :src="it.ImgUrl"/>
    <h3>{{it.Name}}</h3>
    <h3>{{it.Means}}</h3>
    <span>￥{{it.CurrentPrice.toFixed(2)}}</span>
    <span>/{{it.LabelText}}</span>
  </div> 
  -->




</template>


<script>

import indexObj from './index.vue';

import { MessageBox } from 'mint-ui';

export default {
  data(){
    return {
      bool:true,
      // 根据筛选出来的数据做一个符合需求的数据,数据中将全部商品按主题分类，对应统一货号标记，并存放对应主题的商品数据
      themeList:[
        { theme:'女神', mark:'NS', list:[]},
        { theme:'经典', mark:'KSK', list:[]},
        { theme:'伴手礼', mark:'JZ', list:[]},
        { theme:'乳品', mark:'RP', list:[]},
      ],
      // 做一个商品列表用来存放商品数据
      goodsList:[],
      // 做一个商品数组存放某种商品
      goods:{},
      num:1
    }
  },


  mounted(){
  // mounted只写事件执行，从事件初始化执行到触发执行
    this.pageInit();
  },


  methods:{

    // 初始化数据
    pageInit(){
      // 调用获取接口数据的方法初始化返回数据
      this.getListData((res) => {
        // console.log(res);    //测试返回数据返回全部数据，取出需要用的商品数据
        var res = res.data.Tag.cakelist;
        // 遍历主题列表数据
        this.themeList.map((item,index) => {
          // 遍历全部数据
          res.map((it,i) => {
            // 全部数据中符合主题列表中某个货号标记的商品数据放到对应的列表中
            if(it.SupplyNo.indexOf(item.mark) !== -1){
              item.list.push(it);
              // 因接口数据中没有商品图片链接，所以需要通过像首页商品图片链接的拼接方法一样做一个图片链接添加到商品数据中
              // (两种方式:可以将此首页中要用的方法引入此组件直接调用，也可以在core中创建一个global文件夹，内部放一个index.js文件，并该文件内写入此方法，导出后在core.config.js文件中将该方法像$eventBus写入Vue的原型方法中,即可全局调用)
              
              // 上面已经导入了首页变量方法，直接调用即可
              it.ImgUrl = indexObj.methods.setImgUrl(it);
              // console.log(this.themeList);     //测试商品数据中是否已经有了ImgUrl属性
            }
          })
        })
      });

      // 需要的商品数据已准备齐全，现在只需要将4中主题的数据按最大的主题分开，根据页面中的不同类型进行筛选对应的主题，在根据不同的主题，显示对应主题的商品数据
      // （页面中有自营和贝式严选两种类型，自营下有3个主题，贝式严选下有一个主题，所以需要先将主题列表分开，分成3个主题的和1个主题的，每个主题下都已经有自己主题的商品）
      
      // 初始化的时候要先显示有3个主题的自营类型
      this.selectData(1); 
      // 初始化的时候要先显示3个主题的女神主题
      this.selectTheme(0);
    },

    // 筛选数据 ↓
    // 初始化的时候调用传入1，将自营的3个主题筛选出来(点击的时候调用传入2，将贝式严选的1个主题筛选出来)
    selectData(status){
      if(status === 1){
        this.goodsList = this.themeList.slice(0,3);
      }else{
        this.goodsList = this.themeList.slice(3);

      }
    },

    // 控制顶部点击
    leftClick(){
      // 点击第一种类型时，调用方法传入1显示第一类型下的3个主题
      this.selectData(1);
      // 并控制绑定的类将节点效果显示/隐藏
      this.bool = true;
      // 点击第一种类型时，调用方法传入1显示女神主题的商品
      this.selectTheme(0);
    },
    rightClick(){
      // 点击第二种类型时，调用方法传入2显示第二类型下的1个主题
      this.selectData(2);
      // 并控制绑定的类将节点效果显/隐
      this.bool = false;
      // 点击第二章类型时，调用方法传入1，此时goodsList下只有一条数据，将该条数据拿出显示即可
      this.selectTheme(0);
    },

    // 控制主题点击
    selectTheme(index){
      // 调用该函数时传入遍历时的index，将goodsList中的第index条给了goods（和下面的逻辑判断同理）
      this.goods = this.goodsList[index];
      // console.log(this.goods);     //此时测试输出，点击不同主题输出对应主题下的商品数据
      // 如果传入1时，将goodsList中3条数据的第一条拿出来给了goods,传入2时，取第二条，传入3时，取第三条
      // if(status === 1){
      //   this.goods = this.goodsList.slice(0,1);
      // }else if(status === 2){
      //   this.goods = this.goodsList.slice(1,2);
      // }else if(status === 3){
      //   this.goods = this.goodsList.slice(2,3);
      // }
    },

    // 设置跳转到商品详情页并将需要的商品信息挂在参数中(点击跳转时将带去的商品信息即可带到详情页)
    toPath(goodinfo){
      this.$router.push({
        path:"/show",
        query:{
          SupplyNo:goodinfo.SupplyNo,
          Name:goodinfo.Name,
          ID:goodinfo.ID,
          ImgUrl:goodinfo.ImgUrl
        }
      })
    },

    toCart(item){
      // console.log(item)    //输出item为该商品的数据
      // 因购物车需要ID，Name,ImgUrl,Size,CurrentPrice,以及从list过去肯定传一个num为1，所以做一个temp数据存放在vuex的state中，以供购物车取用
      var temp ={
        ID:item.ID,
        Name:item.Name,
        ImgUrl:item.ImgUrl,
        Size:item.Size,
        CurrentPrice:item.CurrentPrice,
        num:this.num,
      };
      console.log(temp);     //每个商品点击购买即可将temp数据带走

      // 调用该方法时顺便调用mint-ui内的提示框
      // alert内有两个参数，一个是提示内容，另一个是一个对象设置提示框的确认取消等按钮参数，执行后是promise,直接接then回调内执行确认和取消后的任务
      MessageBox.alert(item.Name + '成功加入购物车').then((action) => {
        this.$store.commit('getCartInfo',temp);
      })
     

    },

    // 获取接口数据
    getListData(callBack){
      this.$apis.getListData().then((res) => {
        callBack(res);
      })
    }
  }
}

</script>


<style lang="scss">
.mallClass{
  width:100%;
  height:r(40);
  position:fixed;
  top:0;
  z-index: 10000;
  background: #fff;
}
.mallClass ul{
  width:100%;
  height:r(40);
}
.mallClass ul li{
  width:50%;
  height:r(40);
  float:left;
  text-align: center;
  line-height:r(40);
  font-size: 14px;
}
.mall{
  color:#1db0b8;
  border-bottom:2px solid #1db0b8;
}
.class{
  border-bottom: 5px solid #1db0b8;
}
.theme{
  width:100%;
  height:r(50);
  position:fixed;
  left:0;
  right:0;
  top:r(40);
  margin:auto;
  background:#fff;
}
.theme ul{
  width:100%;
  height:r(50);
  display: flex;
  justify-content: center;
}
.theme ul li{
  width:20%;
  height:r(50);
  text-align: center;
  line-height: r(50);
}
.theme ul li a{
  display:inline-block;
  // border-bottom:5px solid #1db0b8;
  color:#333;
}
.slideBox{
  width:100%;
  height:r(30);
  display:flex;
  justify-content: center;
  background: pink;
}
</style>



