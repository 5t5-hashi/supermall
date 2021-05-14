<template>
  <Swiper>
    <SwiperItem v-for="(item, index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad" />
      </a>
    </SwiperItem>
  </Swiper>
</template>
<script>
// 因为swiper的文件下面有index文件把两个文件集合导出成对象，所以这里可以直接用花括号把两个括起来
import { Swiper, SwiperItem } from "../../../components/common/swiper";
export default {
  name: "HomeSwiper",
  data() {
    return {
      isLoad: false,
    };
  },

  props: {
    banners: {
      typeo: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    Swiper,
    SwiperItem,
  },
  methods: {
    imageLoad() {
      // 如果没有发出事件的话发出事件，然后把isLoad改为true使得以后就不能发出数据了，这样数据就只用发出一次了
      if (!this.isLoad) {
        this.$emit("swiperImageLoad");
        this.isLoad = true;
      }
    },
  },
};
</script>
<style scoped>
</style>