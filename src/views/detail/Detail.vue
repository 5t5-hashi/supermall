<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav">
    </detail-nav-bar>
    <Scroll class="content" ref="scroll">
      <DetailSwiper :top-images="topImages"></DetailSwiper>
    <detail-base-info :goods="goods"></detail-base-info>
    <detail-shop-info :shop="shop"></detail-shop-info>
    <detail-goods-info :detailInfo="detailInfo"></detail-goods-info>
    <detail-param-info :paramInfo="paramInfo"></detail-param-info>
    <detail-comment-info ref="comment" :commentInfo="commentInfo"></detail-comment-info>
    <goods-list :goods="recommends"></goods-list>
    </Scroll>
    
  </div>
</template>
<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper"
import DetailBaseInfo from './childComps/DetailBaseInfo.vue';
import DetailShopInfo from './childComps/DetailShopInfo.vue';
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue';
import DetailParamInfo from './childComps/DetailParamInfo.vue';
import DetailCommentInfo from './childComps/DetailCommentInfo.vue';

import Scroll from "../../components/common/scroll/Scroll"
import GoodsList from '../../components/content/goods/GoodsList.vue';

import {debounce} from '../../common/utils'
import { getDetail,Goods,Shop,GoodsParam,getRecommend } from "../../network/detail";
export default {
  name: "Detail",
  components: { 
  DetailNavBar,
  DetailSwiper,
  DetailBaseInfo,
  DetailShopInfo,
  DetailGoodsInfo,
  DetailParamInfo,
  DetailCommentInfo,
  Scroll,
  GoodsList,
   
    
   },
  data() {
    return {
      iid: null,
      topImages: [],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[]
    };
  },
  mounted(){
        const refresh = debounce(this.$refs.scroll.refresh, 500);
        this.itemImgListener=()=>{
          refresh()
        }
        this.$bus.$on('itemImgLoad',this.itemImgListener)
  },
  destroyed(){
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
  created() {
    
    //   1.保存传入导入iid
    this.iid = this.$route.params.iid;
    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      //   1.获取顶部图片轮播数据
      console.log(res);
      const data =res.result
      this.topImages = data.itemInfo.topImages;
      // 2.获取商品信息
      this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)
      // 3.创建店铺信息对象
      this.shop=new Shop(data.shopInfo)
      // 4.保存商品的详细数据
      this.detailInfo=data.detailInfo
      // 5.获取参数信息
      this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)
      // 6.取出评论信息
      if(data.rate.cRate !==0){
        this.commentInfo=data.rate.list[0]
      }
    });
    // 7.请求推荐数据
    getRecommend().then(res=>{
      this.recommends=res.data.list
    })
  },
  methods:{
    imageLoad(){
      this.$refs.scroll.refresh()
    }
  }
};
</script>
<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav{
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content{
  height: calc(100% - 44px);
}
</style>