import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Main from './main.vue'
import homePage from '@modules/home-page'
import detailPage from '@modules/detail-page'

import './main.less'

const router = new Router({
  routes: [
    {path: '/', redirect: '/homePage'},
    {path: '/homePage', component: homePage},
    {path: '/detailPage/:title', component: detailPage}
  ],
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  }
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
