<template>
  <!-- 分析:
    1.先将show.vue的路由配置好，全局钩子函数也配好

    2.在index和list中写入toPath(){}跳转方法以供所有商品(或图片)跳至详情页，跳转时将需要的商品信息挂在参数中，即可带至详情页并供详情页取用(注意：该方法需要传入商品的一些数据)

    3.在详情页的生命周期mounted中获取参数(即商品信息),将其放在data中

    4.将每个主题中的接口链接和参数都拿出来，先对比分析
    女神主题
    接口:http://m.bestcake.com/json1811.ashx?Name=%E4%B8%80%E8%A7%81%E5%80%BE%E5%BF%83&c=NsCakeCenter&m=GetNSCakeByName&v=1573020118046
    参数
    Name: 一见倾心
    c: NsCakeCenter
    m: GetNSCakeByName
    v: 1573020118046

    经典主题
    接口:http://m.bestcake.com/json1811.ashx?City=%E4%B8%8A%E6%B5%B7&ProName=%E6%9E%81%E5%9C%B0%E7%89%9B%E4%B9%B3&c=Product&m=GetCakeByName&v=1573020468789
    参数
    City: 上海
    ProName: 极地牛乳
    c: Product
    m: GetCakeByName
    v: 1573020468789

    伴手礼主题
    接口:http://m.bestcake.com/json1811.ashx?City=%E4%B8%8A%E6%B5%B7&ProName=%E9%87%91%E8%A3%85%E4%BA%91%E9%A1%B6%E6%9B%B2%E5%A5%87&c=IndexCenter&m=GetjzCakeInfo&v=1573020560389
    参数
    City: 上海
    ProName: 金装云顶曲奇
    c: IndexCenter
    m: GetjzCakeInfo
    v: 1573020560389

    乳品主题
    接口:http://m.bestcake.com/json1811.ashx?Name=%E5%8F%AF%E8%8E%B1%E6%80%9D%E8%BF%AA%E5%AE%A2%E8%8B%B1%E5%9B%BD%E8%BF%9B%E5%8F%A3%E5%86%B0%E6%B7%87%E6%B7%8B(125mlx4)&c=NsCakeCenter&m=GetRuPCakeByName&v=1573020653976
    参数
    Name: 可莱思迪客英国进口冰淇淋(125mlx4)
    c: NsCakeCenter
    m: GetRuPCakeByName
    v: 1573020653976

    经过分析对比，接口参数有两种
    一种是参数无city，品名为Name
    一种是参数有city，品名为ProName
    此时需要做设置两种接口(core中api的apis.js中配)
    
    5.
   -->
  <div>

    <!-- 第0层————轮播上的回到list页 -->
    <div class="backtolist">
      <button @click="toPath()">更多商品</button>
    </div>

    <!-- 第一层————轮播 -->
    <div>
      <swiper :config="{id:'show_banner',info:{
        autoplay:2000,
        loop:true,
        pagination:'.swiper-pagination'
        }}">
        <div class="swiper-slide" v-for="(item,index) in [1,2,3,4]" :key="index">
          <img class="bannerImg" :src="bannerImgUrl + `${item}.jpg`"/>
        </div>
      </swiper>
    </div>

    <!-- 第二层————商品名称 -->
    <div>
      <div>{{this.params.Name}}</div>
      <div><span>折</span></div>
    </div>

    <!-- 第三层————商品信息框 -->
    <div v-if="goodType.length !== 0 && goodInfo !== {}">
      
      <div class="clear-fix">
        <div class="fl">甜度</div>
        <div class="fl" v-if="isLoad">
          <img :src="`https://res.bestcake.com/m-images/ww/jz/tiandu_${goodInfo.Sweet || goodInfo.CakeType[0].Sweet}.png`">
        </div>
      </div>
     
      <div>
        <span>口味</span>
        <span>{{goodInfo.CategoryName}}</span>
      </div>
      
      <div>
        <span>原材料</span>
        <span>{{goodInfo.Resource || goodInfo.Resourse}}</span>
      </div>

      <div>
        <span>适应人群</span>
        <span>所有人群</span>
      </div>

      <div class="clear-fix">
        <div class="fl">保鲜条件</div>
        <div class="fl">111</div>
      </div>

    </div>

    <!-- 第四层————评论 -->
    <div>
      <div>商品评价</div>
    </div>

    <!-- 第五层————规格 -->
    <div>
      <div class="type">
        <button v-for="(item,index) in goodType" :key="index" @click="typeSelect(index)">{{item.Size}}</button>
      </div>
      <div class="typeInfo">
        <ul>
          <li>
            <span>图图</span>
            <span>13.5cm * 13.5cm</span>
          </li>
          <li>
            <span>图图</span>
            <span>适合4-5人分享</span>
          </li>
          <li>
            <span>图图</span>
            <span>含5人份餐具</span>
          </li>
          <li>
            <span>图图</span>
            <span>至少需提前一天预约</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 第六层————数量 -->
    <div>
      <span>购买数量</span>
      <div class="fr">
        <button @click="cut()"> - </button>
        <span>{{num}}</span>
        <button @click="add()"> + </button>
      </div>
    </div>

    <!-- 第七层————说明 -->
    <div>
      <div>
        <div class="fl">划线价格</div>
        <div class="fl">商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，并非原价，仅供参考。 </div>
      </div>
      <div>
        <div class="fl">未划线价格</div>
        <div class="fl">商品的实时标价，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化，最终以订单结算页价格为准。 
        </div>
      </div>
    </div>

    <!-- 第八层————底部购买栏 -->
    <div v-if="currentType.length !== 0">
      <div class="fr">
        <span>{{(currentType.CurrentPrice*num || 0).toFixed(2)}}</span>
      </div>
      <div class="fr">
        <button @click="toCart()">加入购物车</button>
      </div>
      <div class="fr">
        <button>立即购买</button>
      </div>
    </div>


  </div>
</template>

<script>

import { MessageBox } from 'mint-ui';

export default {
  data(){
    return {
      params:{},
      bannerImgUrl:'',
      goodType:[],
      goodInfo:{},
      isLoad:false,
      currentType:{},
      num:1,
    }
  },
  mounted(){
    // 将路由带过来的参数放在data中
    this.params = this.$route.query;
    // 在vuex全局state属性中放入一个City:'上海'，方便以后加入不同城市时获取不同数据调用，在这儿取该属性并放进params作为一个参数
    this.params.City = this.$store.state.City;
    // 页面初始化调用
    this.pageInit();
  },
  methods:{
    // 页面初始化方法
    pageInit(){
      var promise;
      // 做逻辑判断，根据跳转带过来的商品货号调用不同的接口，获取对应的数据
      if(this.params.SupplyNo.indexOf('NS') !== -1){
        // 若带回的参数中的货号是NS开头的，调用轮播图片拼接方法并传入相应的参数将拼接后的轮播图片链接放在data中的bannerImgUrl中，并接着调用axios返回响应的接口数据（axios执行后是一个promise，先放在一个promise中再统一处理），货号是其他的同理

        // NS货号的图片链接类型https://res.bestcake.com/m-images/ns-detail/一见倾心/一见倾心-1.jpg?v=20170525?v=1
        this.bannerImgUrl = this.setImgUrl('ns-detail');
        // 发axios时将需要的参数传入(此axios需要Name和m)
        promise = this.$apis.getShowDataOne({
          Name:this.params.Name,
          m:'GetNSCakeByName'
        })
      }else if(this.params.SupplyNo.indexOf('KSK') !== -1){
        // KSK货号的图片链接类型https://res.bestcake.com/m-images/jd-detail/极地牛乳/%E6%9E%81%E5%9C%B0%E7%89%9B%E4%B9%B3-1.jpg?v=20170607
        this.bannerImgUrl = this.setImgUrl('jd-detail');
        // 发axios时将需要的参数传入(此axios需要ProName和City和c和m)
        promise = this.$apis.getShowDataTwo({
          City:this.params.City,
          ProName:this.params.Name,
          c:'Product',
          m:'GetCakeByName'
        })
      }else if(this.params.SupplyNo.indexOf('JZ') !== -1){
        // JZ货号的图片链接类型https://res.bestcake.com/m-images/jz-detail/金装云顶曲奇/%E9%87%91%E8%A3%85%E4%BA%91%E9%A1%B6%E6%9B%B2%E5%A5%87-1.jpg?v=20190128
        this.bannerImgUrl = this.setImgUrl('jz-detail');
        promise = this.$apis.getShowDataTwo({
          City:this.params.City,
          ProName:this.params.Name,
          m:'GetjzCakeInfo',
          c:'IndexCenter'
        })
      }else if(this.params.SupplyNo.indexOf('RP') !== -1){
        // RP货号的图片链接类型https://res.bestcake.com/m-images/rp-detail/可莱思迪客英国进口冰淇淋(125mlx4)/可莱思迪客英国进口冰淇淋(125mlx4)-1.jpg?v=20170525?v=1
        this.bannerImgUrl = this.setImgUrl('rp-detail');
        promise = this.$apis.getShowDataOne({
          Name:this.params.Name,
          m:'GetRuPCakeByName'
        })
      };

      //上面的每一个if中发的axios返回的都是promise，在这里处理该promise，拿到数据
      promise.then((res) => {
        // console.log(res);    //测试返回数据，查看每种主题的商品的接口参数是否正确，正确则可以处理数据
        var res = res.data.Tag;
        // console.log(res);    //测试需要取用的数据，发现有两种类型的数据，女神，伴手礼和乳品内的商品返回的数据存在于数组，经典内的商品返回的数据存在于对象中，此时需要做处理

        // 如果res是数组（对比发现数组内存放的多条数据是以城市区分，且一个商品有多个规格，算多条数据，其他数据基本一致）
        if(Array.isArray(res)){
          // 1.先遍历该数组，将属于指定城市的数据都放在一个数组中
          res.map((item) => {
            if(item.City === this.params.City){
              this.goodType.push(item);
            }
          })
          // console.log(this.goodType);    //测试goodType是否已经取到

          // 2.res返回两种不同的 数据，女神/伴手礼/乳品三中主题的商品数据返回在数组中，而经典主题的商品返回的数据返回在对象中，但是上面第1步判断是否是数组之后，处理数组时是通过匹配城市来处理的，经过分析发现数组数组存在两种情况，女神和乳品的数组数据内有城市属性，而伴手礼的数组数据内无城市属性，此时伴手礼主题的商品进入时goodType数组内无数据，此时将该res数组直接给了goodType
          if(this.goodType.length === 0){
            this.goodType = res;
          }

          // 3.将同个商品的同个城市的随便一个规格的数据先放在一个对象中
          this.goodInfo = this.goodType[0];
          // console.log(this.goodInfo);    //测试goodInfo是否从goodType中拿到
          
        }else {
          // 如果是返回数据是对象，则直接将不同的商品规格数组放在goodType数组中，并将需要的整条数据放在商品信息goodInfo对象中
          this.goodType = res.infos.CakeType;
          this.goodInfo = res.infos;
        }

        // data内添变量isLoad:false,在这儿将其值改为true，然后使用上面的数据遍历前， 用v-if做异步处理
        this.isLoad = true;
        // 初始化时调用一次规格选择，默认选择第一个
        this.typeSelect(0);
      }) 

    },

    // 拼接轮播图链接
    setImgUrl(detail){
      // 每种主题下的详情页轮播图链接
      // 女神https://res.bestcake.com/m-images/ns-detail/一见倾心/一见倾心-1.jpg?v=20170525?v=1
      // 
      return `https://res.bestcake.com/m-images/${detail}/${this.params.Name}/${this.params.Name}-`;
    },

    // 规格选择
    typeSelect(index){
      // 将当前点击的规格给了data中的currentType
      this.currentType = this.goodType[index];
      console.log(this.currentType);     //测试输出对应规格中存放的各自的数据，即可调用对应的价格之类信息
    },

    // 数量添加
    add(){
      this.num++;
    },

    // 数量减少
    cut(){
      if(this.num>1){
        this.num--;
      }
    },

    // 加入购物车
    toCart(){
      // 声明一个模板数据，存放商品的数据，执行时将数据存在vuex中（从list页带的数据没有num，从show页带的数据有num，且经过分析发现同一个商品的不同规格的商品ID是不同的，其他同）
      var temp = {
        ID:this.currentType.ID || this.currentType.Id,
        Name:this.currentType.Name,
        CurrentPrice:this.currentType.CurrentPrice,
        Size:this.currentType.Size,
        num:this.num,
        // 从cart页的图都是展示的像list页一样的图，而且本show页的轮播图是通过方法拼接的，且商品CurrentType中无轮播图字段，所以从list进入show中时给参数中添加一个ImgUrl参数，在show页直接取参数中的ImgUrl
        ImgUrl:this.params.ImgUrl
      }
      // console.log(temp);     //测试发现不同主题的商品ID字段不同，女神和乳品是ID，经典和伴手礼是Id，且同一商品的id值不同

      // 调用该方法时顺便调用mint-ui内的确认提示框
      // confirm两种状态，确认执行then内回调执行，取消catch内回调执行
      // 有两个参数，参一为提示信息，参二为对象（内设确认和取消按钮的相关数据）
      MessageBox.confirm('成功添加' + (this.currentType.Name || '') + '到购物车',{confirmButtonText:'去结算',cancelButtonText:'再看看'}).then(action => {
        // 确认之后调用vuex的mutations内getCartInfo将此数据存进vuex中state中的cartList
        this.$store.commit('getCartInfo',temp);
        // 并跳转到购物车页
        this.$router.push('cart');
      }).catch((err) => {
        // 取消后(再看看)不进行任何操作即可关闭提示框留在本页面
        
      })
    },
    toPath(){
      this.$router.push('list');
    }
  }
}
</script>

<style lang="scss">
.backtolist{
  position:absolute;
  right:0;
  top:r(20);
  z-index:10000;
}
#show_banner{
  width:100%;
  height:r(445);
}
.bannerImg{
  width:100%;
  height:100%;
}
</style>