<template>
  <div id="home">
    <NavBar class="home-nav"><div slot="center">购物街</div></NavBar>
    <tab-control
      class="tab-control"
      @tabClick="tabClick"
      :titles="['流行', '新款', '精选']"
      ref="tabControl1"
      v-show="isTabFixed"
    ></tab-control>
    <Scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentscroll"
      @pullingUp="loadMore"
    >
      <HomeSwiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></HomeSwiper>
      <RecommendView :recommends="recommends"></RecommendView>
      <FeatureView></FeatureView>
      <!-- 把class加在Home里的组件标签上是因为组件其他地方要用，但是这个css只想组件在这个地方时使用，所以要单独加css -->
      <tab-control
        class="tab-control-top"
        @tabClick="tabClick"
        :titles="['流行', '新款', '精选']"
        ref="tabControl2"
      ></tab-control>
      <GoodsList :goods="showGoods"></GoodsList>
    </Scroll>
    <!-- .native是在监听组件时使用，必须加上才能监听组件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>
<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "../../components/common/navbar/NavBar.vue";
import TabControl from "../../components/content/tabControl/TabControl";
import GoodsList from "../../components/content/goods/GoodsList";
import Scroll from "../../components/common/scroll/Scroll";
import BackTop from "../../components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "../../network/home";
import { debounce } from "../../common/utils";
export default {
  name: "Home",

  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  computed: {
    showGoods() {
      return this.goods[this.crrentType].list;
    },
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY();
    // this.saveY = this.$refs.scroll.scroll.y;
    // 取消全局事件的监听
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: {
          page: 0,
          list: [],
        },
        new: {
          page: 0,
          list: [],
        },
        sell: {
          page: 0,
          list: [],
        },
      },
      crrentType: "pop",
      isShowBackTop: true,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      itemImgListener:null
    };
  },

  created() {
    // 请求多个数据
    this.getHomeMultidata();
    // 请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    // 1.图片加载完成的事件监听
    // 接收事件总线传的itemImageLoad
    const refresh = debounce(this.$refs.scroll.refresh, 500);
    
    // 对监听事件进行保存
    this.itemImgListener=()=>{
      refresh();
    }

    this.$bus.$on("itemImageLoad", this.itemImgListener);
    // 2.获取tabControl的offsetTop
    // 所有组件都有一个属性$el:用于获取组件中的元素
    // this.$refs.tabControl.$el.offsetTop;
  },
  methods: {
    /**
     * 事件监听的方法
     */

    tabClick(index) {
      switch (index) {
        case 0:
          this.crrentType = "pop";
          break;
        case 1:
          this.crrentType = "new";
          break;
        case 2:
          this.crrentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      // scroll里的scrollTo函数，表示到什么位置，用了多久,调用的Scroll的scrollTo函数
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    contentscroll(position) {
      // 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
      // 决定tabControl是否吸顶(position:fiexd)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.crrentType);
      // 重新刷新,重新计算可滚动的高度
      this.$refs.scroll.scroll.refresh();
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      // console.log(this.$refs.tabControl.$el.offsetTop);
    },
    /**
     * 网络请求相关的代码
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      // 每次传的每个type类型的page依次加1
      const page = this.goods[type].page + 1;
      // 调用getHomeGoods并且发送请求数据
      getHomeGoods(type, page).then((res) => {
        // console.log(res);
        // 把接口获得的数组中的每一个数据单拿出来放到data的list数组中
        this.goods[type].list.push(...res.data.list);
        // list每得到一组数据后data中的page页数就会+1
        this.goods[type].page += 1;
        // 上拉加载更多只能调用一次所以用finishpullup
        this.$refs.scroll.finishPullUp();
        // console.log(this.goods[type].page);
      });
    },
  },
};
</script>
<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* width: 100%;
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  z-index: 2; */
}
/* .tab-control-top {
  position: sticky;
  top: 44px;
  z-index: 1;
  background-color: #f2f2f2;
} */
.tab-control {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  position: absolute;
  overflow: hidden;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>