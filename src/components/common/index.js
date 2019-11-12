import swiper from './swiper.vue';
import { Tabbar, TabItem} from "mint-ui";

export default (Vue) => {
    Vue.component('swiper',swiper);
    Vue.component(Tabbar.name, Tabbar);
    Vue.component(TabItem.name, TabItem);
}