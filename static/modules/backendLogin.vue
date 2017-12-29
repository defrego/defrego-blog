<template>
	<div class="backendLogin">
		<form action="/data/login" method="post" @submit.prevent="doLogin">
			<div><label>Username</label><input type="text" v-model="form.username" /></div>
			<div><label>Password</label><input type="password" v-model="form.password" /></div>
			<div>
				<label> </label>
				<input type="submit" value="Login" />
				<span style="color: red">{{tips}}</span>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	name: 'backendLogin',
	data() {
		return {
			form: {
				username: '',
				password: ''
			},
			tips: ''
		}
	},
	methods: {
		doLogin() {
			let data = {
				'username': this.form.username,
				'password': this.form.password
			}
			this.$http.post('/data/login', data).then(res => {
				document.cookie = "bLogin=true;"
				this.$router.push('/backendManage')
			}, err => {
				this.tips = 'username or password error!'
				setTimeout(() => {this.tips = ''}, 3000)
			})
		}
	}
}
</script>

<style lang="less" scoped="">
.backendLogin {
	padding-top: 100px;
	form {
		width: 420px;
		margin: 0 auto;
		padding-left: 100px;
		div {
			width: 100%;
			margin: 10px 0;
			text-align: left;
			label, input {
				display: inline-block;
			}
			label {
				display: inline-block;
				width: 120px;
				height: 18px;
				line-height: 18px;
			}
		}
	}
}
</style>