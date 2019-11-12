<template>
  <div class="home">

    <!-- 切换路由组件 -->
     <keep-alive>
          <router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title"/>
    </keep-alive>  
          <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title"/>
          <!-- img-set="/img/favicon.ico" -->

    <!-- 底部导航 -->
    <!-- 1.将底部导航组件放在components内layout中(tabbar.vue)，并写入模板以及逻辑，在Home.vue中引入该组件，并将节点放在模板中,最后将组件导出。
    2.在common的index.js中引入mint-ui内的tabbar，并将其注册到全局组件 -->
    <tabbar />
    
  </div>
</template>

<script>

import tabbar from "@/components/layout/tabbar.vue";

export default {
  components:{
    tabbar
  }
}
</script>

