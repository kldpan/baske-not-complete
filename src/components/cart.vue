<template>
  <div>
    
    <!-- 第一层————商品数据 -->
    <div v-if="cartInfo.length !== 0">
      <ul>
        <li v-for="(item,index) in cartInfo" :key="index" class="clear-fix">


          <!-- 选择按钮图 -->
          <div class="fl">
            <!-- <input type="checkbox" @click="selectOne(item)" v-model="item.bool"> -->
            <img :src="`https://res.bestcake.com/m-images/order/mw_firm_duihao_${item.bool?1:2}.jpg`" alt=""@click="selectOne(item)"/>
          </div>

          <!-- 商品图片 -->
          <div class="fl" style="width:150px;height:150px;">
            <img style="width:100%;height:100%;" :src="item.ImgUrl" alt=""/>
          </div>

          <!-- 商品信息 -->
          <div class="fl">
            <h3>{{item.Name}}</h3>
            <p>{{item.Size}}</p>
            <span>{{(item.CurrentPrice * item.num).toFixed(2)}}</span>
          </div>

          <!-- 商品数量 -->
          <div class="fr">
            <button @click="cut(item,index)"> - </button>
            <span>{{item.num || 1}}</span>
            <button @click="add(item)"> + </button>
          </div>
        </li>
        <b></b>
      </ul>
    </div>

    <div v-if="cartInfo.length === 0">
      <h1>您的购物车空空如也！</h1>
    </div>

    <!-- 第二层————推荐商品 -->
    <div>
      <div>
        <div style="border-bottom:2px solid #333">Hot Recommend</div>
        <div>热销新品推荐</div>
      </div>
      <div>
        推荐商品
      </div>
    </div>

    <!-- 第三层————底部结算 -->
    <div v-if="cartInfo.length !== 0" style="position:fixed;bottom:100px;right:0">
      <div class="fr">
        <!-- <input type="checkbox" v-model="flag" @click="selectAll()"> -->
        <img :src="`https://res.bestcake.com/m-images/order/mw_firm_duihao_${flag ? 1 : 2}.jpg`" @click="selectAll()"/>
        <span>全选</span>
      </div>
      <div class="fr">
        <button @click="clearAll()">清空</button>
      </div>
      <div class="fr">
        <span>合计：</span>
        <span>{{total}}</span>
      </div>
      <div class="fr">
        <span>结算</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data(){
    return {
      cartInfo:[],
      total:0,
      // 用flag值来改变所有复选框,全选框的选中与否的状态
      flag:false,
      // 用isChecked数组来记录每个复选框的状态值
      isChecked:[],
    }
  },
  mounted(){
    // 初始化时把vuex中的购物车数据取回来
    this.cartInfo = this.$store.state.cartList;
    // console.log(this.cartInfo);    //测试该商品是否从vuex中取出
    // 初始化时遍历cartInfo,让所有的数据的bool值为true
    this.cartInfo.map((item) => {
      item.bool = true;
      this.count(item);
    })
  },
  methods:{
    add(item){
      item.num++;
      this.count();
    },
    cut(item,index){
      if(item.num > 1){
        item.num--;
        this.count();
      }else if(item.num === 1){
        this.delete(item,index);
      }
    },
    delete(item,index){
      this.cartInfo.splice(index,1);
    },
    // 这里不要将计算总价放在computed属性计算中，而是单独写一个方法方便调用，在每次点击加，减，商品前的选中按钮时调用该方法来计算，而且在计算中可以写进点击全选时的逻辑
    count(){
      this.total = 0;
      this.isChecked = [];
      this.cartInfo.map((item) => {
        if(item.bool){
          this.total += item.num * item.CurrentPrice;
          this.isChecked.push(item);
        }
      })

      // 每次在选择单个商品时，每次都执行count，并在当选中商品时，将选中的商品数据放在isChecked数组中，如果该数组的长度和所有购物车商品数组长度一样，则说明全选中了，此时将开关flag开启（即全选中），否则，将开关flag关闭（即有未选中的）
      if(this.isChecked.length === this.cartInfo.length){
        this.flag = true;
      }else{
        this.flag = false;
      }
    },
    selectOne(item){
      // 点击选择单个商品按钮时，改变当前商品的bool值即可，并参与计算
      item.bool = !item.bool;
      this.count();
    },
    selectAll(){
      // 点击选中全选按钮时，将该按钮双向绑定flag，并判断该flag值，如果该值是true时，遍历所有的商品，将所有商品的bool值改为true,否则都改为false
      if(this.flag){
        this.cartInfo.map((item) => {
          item.bool = false;
          this.count();
        })
      }else{
        this.cartInfo.map((item) => {
          item.bool = true;
          this.count();
        })
      }
    },
    clearAll(){
      this.cartInfo.map((item,index) => {
        // 清空数组的方法：直接splice传0
        this.cartInfo.splice(0);
      })
    }
  }
};
</script>
