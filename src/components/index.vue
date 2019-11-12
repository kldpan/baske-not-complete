<template>
  <!-- 所有节点都放在一个div中,每一层都在一个div中 -->
  <div>
    <!-- 第一层————顶部定位 -->
    <div class="position">
      <img class="location" src="https://res.bestcake.com/images/newIndex/localtion.png" alt="">
      <span> 上海 </span>
      <img class="direction" src="https://res.bestcake.com/images/newIndex/more.png"/>
    </div>

    <!-- 第二层————轮播组件 -->
    <!-- 只要从接口中拿数据，先用v-if做异步处理再遍历 -->
    <div v-if="SwiperBannerList.length !== 0">
      <swiper :config="{id:'banner',info:{
        autoplay:2000,
        loop:true,
        pagination:'.swiper-pagination'
        }}">
        <div class="swiper-slide" v-for="(item,index) in SwiperBannerList" :key="index">
          <img class="banner_img" :src="item.ImgUrl">
        </div>
      </swiper>
    </div>

    <!-- 第三层————图片说明 -->
    <div class="img_title">
      <img src="https://res.bestcake.com/images/newIndex/title.png?v=1"/>
    </div>
    
    <!-- 第三层————图片活动 -->
    <div class="img_active">
      <img src="https://res.bestcake.com/m-images/banner1_list/865091713750555400.jpg"/>
    </div>

    <!-- 第四层————首页产品分类 -->
    <div class="TopIconListBox" v-if="TopIconList.length !== 0">
      <ul>
        <li class="TopIconList" v-for="(item,index) in TopIconList" :key="index">
          <div>
            <img :src="item.ImgUrl"/>
            <div>{{item.ActName}}</div>
          </div>
        </li>
      </ul>
    </div><br>

    <!-- 第五层————公告 -->
    <div class="Broadcast">
      <div class="BroadcastBox">
        <div class="Notice">通知</div>
        <div class="NoticeListBox">
          <div class="NoticeList">{{this.NoticeList}}​</div>
        </div>
      </div>
    </div>

    <!-- 第六层————图片导购 -->
    <div class="imgToBuy" v-if="CenterContentList.length !== 0">
      <ul>
        <li class="CenterContentList" v-for="(item,index) in CenterContentList" :key="index">
          <a href="#">
            <img :src="item.ImgUrl">
          </a>
        </li>
      </ul>
    </div><br>

    <!-- 七八九层遍历————一个主题下面一个轮播 -->
    <div class="goodsBox" v-if="SaleList.length !== 0">
      <div v-for="(item,index) in SaleList" :key="index" class="themeImg">
        <!-- 主题图片 -->
        <div class="banner">
            <img :src="item.TabImgUrl" />
          
          
            <!-- 主题对应商品轮播 -->
          <swiper :config="{id:'banner'+index,info:{slidesPerView:2.3,spaceBetween:30}
          }">
            <div class="swiper-slide" v-for="(value,idx) in item.CakeList" :key="idx">
              <div class="slide">
                <img :src="value.ImgUrl" class="bannerImg"/>
                <div class="goodName">{{value.Name}}</div>
                <div class="goodInfo">
                  <span class="price">￥{{value.Price}} </span>
                  <span class="size"> / {{value.Size}}</span>
                </div>
              </div>
              
            </div>
          </swiper>
          
          
        </div>
      </div>
    </div>




  </div>
</template>

<script>
export default {
  data() {
    return {
      SwiperBannerList:[],
      TopIconList:[],
      NoticeList:[],
      CenterContentList:[],
      SaleList:[],
      // index:'',      //加上是防止出现警告index为定义
    };
  },
  mounted(){
    // 调用apis中的获取首页数据的axios获取数据并在then中处理数据，同时将数据放在data中
    this.$apis.getIndexData().then((res) => {
      // console.log(res);    //测试数据是否获取，获取成功后处理
      var res = res.data.Tag.mainresult;
      this.SwiperBannerList = res.SwiperBannerList;
      // console.log(this.SwiperBannerList);

      // ↑ 上面是将获取的数据中的轮播图处理并给了data以供轮播组件变量

      // ↓ 下面是将获取的数据中的首页分类数据处理并给了data以供遍历

      var TopIconList = res.TopIconList;
      this.TopIconList = TopIconList;

      // ↓ 下面是将公告信息处理给data
      var NoticeList = res.NoticeList;
      this.NoticeList = NoticeList;

      // ↓ 下面是将图片导购数据处理给data
      var CenterContentList = res.CenterContentList;
      this.CenterContentList = CenterContentList;

      // ↓ 下面是每个主题及主题对应下的商品信息(注意:该数据获取后无商品图片链接，需要手动根据对应货号生成对应的图片链接)
      var SaleList = res.SaleList;
      this.SaleList = SaleList;
      // SaleList下需要用的数据是嵌套数据，先遍历一层
      SaleList.map((item) => {
        // 获取到了SaleList下的CakeList是串，需要先解析（去引号）
        item.CakeList = JSON.parse(item.CakeList);
        // 解析后再遍历一次取内部的值
        item.CakeList.map((item) => {
          // 因为cakeList内没有图片链接，但页面中有图片，有货号，且经过对比发现图片链接和货号存在对应关系，所以需要在此给cakeList内做一个ImgUrl，调用setImgUrl方法将货号转为图片链接（具体在方法内）
          item.ImgUrl = this.setImgUrl(item);
        })
      })
    })
  },
  methods:{
    setImgUrl(item){
      // 经过对比发现货号和链接内的某个参数有关系，利用逻辑做个拼接
      // 1.货号为KSK开头的"SupplyNo":"KSK-0975-1"
      // 链接为https://res.bestcake.com/m-images/ww/jd/草莓拿破仑.png?v=637085486925412100
      // 2.货号为NS开头的"SupplyNo":"NS-0146-12"
      // 链接为https://res.bestcake.com/m-images/ww/ns/洛可可甜心.jpg?v=637085486925412100
      // 3.货号为JZ开头的"SupplyNo":"JZ-0044-9"
      // 链接为https://res.bestcake.com/m-images/ww/jz/蝎美人.png?v=637085486925412100
      // 4.货号为RP开头的"SupplyNo":"RP-0012-135"
      // 链接为https://res.bestcake.com/m-images/ww/rp/可莱思迪客英国进口冰淇淋(125mlx4).jpg?v=637085486925412100

      // 第一步先将图片链接中相同的部分拿出
      var url = 'https://res.bestcake.com/m-images/ww';
      // 第二步将图片链接中最后的时间戳拿出
      var date = new Date(); 
      var vtime = date.getTime();
      // 第三步根据货号拼链接
      if(item.SupplyNo.indexOf('KSK') !== -1){
        return url + '/jd/' + item.Name + '.png?v=' + vtime;
      }else if(item.SupplyNo.indexOf('NS') !== -1){
        return url + '/ns/' + item.Name + '.jpg?v=' + vtime;
      }else if(item.SupplyNo.indexOf('JZ') !== -1){
        return url + '/jz/' + item.Name + '.png?v=' + vtime;
      }else if(item.SupplyNo.indexOf('RP') !== -1){
        return url + '/rp/' + item.Name + '.jpg?v=' + vtime;
      };
    },
    // toPath(item){
    //   this.$router.push({
    //     path:"/list",
    //     query:{
    //       filtername=item.
    //     }
    //   })
    // },
  }
}
</script>

<style lang="scss" scoped>
  .position{
    width:90%;
    height:r(30);
    margin:0 auto;
    padding:r(10) 0;
  }
  .position .location{
    width:r(20);
    vertical-align:middle;
  }
  .position span{
    font-size:r(16);
    line-height:r(30);
    vertical-align:middle;
  }
  .position .direction{
    width:r(10);
    vertical-align:middle;
  }
  #banner{
    width:90%;
    height:r(198);
    margin:0 auto;
  }
  .banner_img{
    width:100%;
    height:100%;
    border-radius: r(12);
    border:none !important;
  }
  .img_title{
    width:100%;
    height:r(38);
  }
  .img_title img{
    width:100%;
    height:100%;
  }
  .img_active{
    width:90%;
    height:r(100);
    margin:0 auto;
  }
  .img_active img{
    width:100%;
    height:100%;
  }
  .TopIconListBox{
    width:90%;
    height:r(220);
    margin:0 auto;
    overflow: hidden;
  }
  .TopIconListBox ul{
    width:100%;
    height:100%;
  }
  .TopIconListBox ul .TopIconList{
    width:24%;
    height:r(88);
    float:left;
    position:relative;
    margin-top:r(20);
    
  }
  .TopIconListBox ul .TopIconList > div{
    width:24%;
    height:r(120);
  }
  .TopIconListBox ul .TopIconList div img{
    width:r(57);
    height:r(57);
    text-align:center;
    position:absolute;
    left:50%;
    transform: translate(-50%);
  }
  .TopIconListBox ul .TopIconList div div{
    width:100%;
    text-align:center;
    color:#333;
    position: absolute;
    bottom:0;
    left:0;
  }
  .Broadcast{
    width:100%;
    height:r(40);
    border-top:r(8) solid #fafafa;
    border-bottom:r(8) solid #fafafa;

  }
  .BroadcastBox{
    width:90%;
    height:r(40);
    margin:r(10) auto 0;
    position:relative;
  }
  .BroadcastBox .Notice{
    width:10%;
    height:r(20);
    line-height: r(20);
    background: #1fb1b8;
    color:#fff;
    border-radius: r(5);
    text-align: center;
  }
  .BroadcastBox .NoticeListBox{
    width:88%;
    overflow: hidden;
    position:absolute;
    right:0;
    top:0;
    white-space: nowrap;
  }
  .BroadcastBox .NoticeList{
    line-height: r(20);
    color:#1fb1b8;
    font-size: 14px;
    margin-left: r(5);
    animation:goleft 5s linear infinite;
  }
  @keyframes goleft{
    0%{transform: translateX(0);}
    25%{transform: translateX(-50px);}
    50%{transform: translateX(-100px);}
    75%{transform: translateX(-150px);}
    100%{transform: translateX(-200px);}
  }
  .imgToBuy{
    width:90%;
    margin:r(10) auto 0;
    overflow: hidden;
  }
  .imgToBuy ul{
    width:100%;
    height:100%;
  }
  .imgToBuy ul .CenterContentList{
    width:47%;
    height:100px;
    float:left;
    border-radius:r(8);
    margin:r(5);
    overflow: hidden
  }
  .imgToBuy ul .CenterContentList img{
    width:100%;
    height:100%;
  }
  .goodsBox{
    width:100%;
    margin:0 auto r(50);
    overflow: hidden;
    padding-top:r(10);
    background:#fafafa;
  }
  .goodsBox .themeImg{
    width:100%;
    height:r(400);
  }
  .goodsBox .themeImg .banner img{
    width:100%;
  }
  .goodsBox .slide{
    width:r(146);
    margin-top: r(10);
    margin-bottom: r(5);
    padding: r(5);
    margin-left: r(3);
    background: #fff;
    border-radius: r(3);
    box-shadow: 0 r(2) r(6) rgba(0,0,0,0.1);
  }
  .goodsBox .slide:first-of-type{
    margin-left:r(15);
  }
  .goodsBox .slide .bannerImg{
    width:r(146);
    height:r(146);
  }
  .goodsBox .slide .goodName{
    width: r(146);
    margin: 0 auto;
    height: r(20);
    margin-top: r(10);
    overflow: hidden;
    line-height: r(20);
    font-weight: bold;
    font-size:r(14);
    margin-left:r(10);
  }
  .goodsBox .slide .goodInfo{
    width: r(146);
    height:r(20);
    margin: r(10) auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size:r(14);
    margin-left:r(10);
  }
  .goodsBox .slide .goodInfo .price{
    color: #cc2825;
  }
  .goodsBox .slide .goodInfo .size{
    color:#999;
  }
</style>
