<template>
  <div id="app">
    <!-- keep-alive,保持home不被销毁,此时如果不排除Detail
    的话点击图片进入详情页返回后点击新图片不会拿到新数据 -->
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <div></div>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
import MainTabBar from "./components/content/mainTabbar/MainTabBar";

export default {
  name: "app",
  components: {
    MainTabBar,
  },
};
</script>

<style>
@import "assets/css/base.css";
@import "assets/css/phone.css";
</style>
