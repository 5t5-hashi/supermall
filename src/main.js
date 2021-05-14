import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

