import Vue from "vue";
import VueRouter from "vue-router";
import params from "@/core/api/params";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "index",
        name: "index",
        component: () => import("@/components/index.vue"),
        meta: {
          title: "首页"
        }
      },
      {
        path: "list",
        name:"list",
        component: () => import("@/components/list.vue"),
        meta: {
          title: "分类页",
        }
      },
      {
        path: "show",
        name:"show",
        component: () => import("@/components/show.vue"),
        meta: {
          title: "详情页",
        }
      },
      {
        path: "cart",
        name:"cart",
        component: () => import("@/components/cart.vue"),
        meta: {
          title: "购物车"
        }
      },
      {
        path: "user",
        name:"user",
        component: () => import("@/components/user.vue"),
        meta: {
          title: "用户"
        }
      }
    ],
    redirect: "/index"
  }
];
const router = new VueRouter({
  // mode:"history",
  routes
});
//全局的路由钩子函数
router.beforeEach((to, from, next) => {
  // console.log(params.userType)
  //from  从哪来
  //to    到哪去
  //next(); 是否到下一个路由
  // console.log(to.path);
  // if(to.path=="/"){
  //   next({path:"/index"})
  // }else{
  //   next();
  // }
  if (to.path == "/") {
    if (params.userType === "index") {
      next({
        path: "/index"
      });
    } else if (params.userType === "list") {
      next({
        path: "/list"
      });
    } else if (params.userType === "show") {
      next({
        path: "/show"
      });
    } else if (params.userType === "cart"){
      next({
        path: "/cart"
      })
    } else if (params.userType === "user"){
      next({
        path: "/user"
      })
    }else{
      next();
    }
  }else{
    next();
  } 
});

router.afterEach((to, from) => {
  // console.log("路由跳转完毕")
});

export default router;
