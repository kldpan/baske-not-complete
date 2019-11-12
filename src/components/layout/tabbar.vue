<template>
  <div class="home">
    <!-- 底部导航 -->
    <mt-tabbar v-model="selected" class="btm_nav">
        <mt-tab-item v-for="(item,index) in pathList" :key="index" @click.native="selectIcon(index)" class="nav">
            <img slot="icon" :src="`${item.ImgUrl}${num === index ? '2.png' : '1.png'}`">
        </mt-tab-item>
    </mt-tabbar>

  </div>
</template>

<script>
export default {
  data() {
    return {
      pathList: [
        { pathname: "index", path: "/index", ImgUrl:"https://res.bestcake.com/m-images/ww/foot/foot-menu-a-" },
        { pathname: "list", path: "/list", ImgUrl:"https://res.bestcake.com/m-images/ww/foot/foot-menu-b-"  },
        { pathname: "cart", path: "/cart", ImgUrl:"https://res.bestcake.com/m-images/ww/foot/foot-menu-c-" },
        { pathname: "user", path: "/user", ImgUrl:"https://res.bestcake.com/m-images/ww/foot/foot-menu-d-" }
      ],
      selected:'',
      num:0
    };
  },
  methods: {
    selectIcon(index){
        // 当点击该图标时，将num换为该图标的下标值，节点处的图标链接改为图标下标处时2.png,不是该下标值时，改为1.png
        this.num = index;
        // 并在点击时跳转到各自的页面
        this.$router.push(this.pathList[index].path);
    }
  }
};
</script>

<style lang="scss" scoped>
.btm_nav{
  position:fixed;
  bottom:0;
  z-index:10000;
}
</style>