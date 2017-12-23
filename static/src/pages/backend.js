import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import Backend from '../modules/backend.vue'
import backendLogin from '../modules/backendLogin.vue'
import backendManage from '../modules/backendManage.vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const router = new Router({
  routes: [
    {path: '/', redirect: '/backendLogin'},
    {path: '/backendLogin', component: backendLogin, meta: {needAuth: false}},
    {path: '/backendManage', component: backendManage, meta: {needAuth: true}}
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
  render: h => h(Backend)
})
