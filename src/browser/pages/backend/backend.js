import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import backendLogin from '@modules/backend-login'
import backendManage from '@modules/backend-manage'
import manageArticle from '@modules/manage-article'
import manageUser from '@modules/manage-user'

import './backend.less'

const router = new Router({
  routes: [
    {path: '/', redirect: '/backendLogin'},
    {path: '/backendLogin', component: backendLogin, meta: {needAuth: false}},
    {
      path: '/backendManage',
      component: backendManage,
      children: [{
        path: '/',
        redirect: 'manageArticle'
      }, {
        path: 'manageArticle',
        component: manageArticle,
        meta: {needAuth: true}
      }, {
        path: 'manageUser',
        component: manageUser,
        meta: {needAuth: true}
      }]
    }
  ]
})
router.beforeEach((to, from, next) => {
	let bLogin
	if (to.meta.needAuth) {
		let arr = document.cookie.split(';')
		for (let index in arr) {
			let key = arr[index].split('=')[0]
			let item = arr[index].split('=')[1]
			if (key === 'bLogin') {
				bLogin = item === 'true'
				break
			}
		}
		if (bLogin) {
			next()
		} else {
			next('/')
		}
	} else {
		next()
	}
})

Vue.use(Router)
Vue.use(Resource)
Vue.use(mavonEditor)

new Vue({
  el: '#app',
  router,
  render: h => h({
    template: '<div id="app"><router-view></router-view></div>'
  })
})
