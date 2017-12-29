import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import Main from '../modules/Main.vue'
import homePage from '../modules/homePage.vue'
import detailPage from '../modules/detailPage.vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const router = new Router({
  routes: [
    {path: '/', redirect: '/homePage'},
    {path: '/homePage', component: homePage},
    {path: '/detailPage/:title', component: detailPage}
  ]
})
Vue.use(Router)
Vue.use(Resource)
Vue.use(VueLazyload)
Vue.use(mavonEditor)

new Vue({
  el: '#app',
  router,
  render: h => h(Main)
})
