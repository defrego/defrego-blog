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

<style lang="less" scoped>
.backendLogin {
  padding-top: 6.25rem;
  form {
    width: 26.25rem;
    margin: 0 auto;
    padding-left: 6.25rem;
    div {
      width: 100%;
      margin: 0.625rem 0;
      text-align: left;
      label, input {
        display: inline-block;
      }
      label {
        display: inline-block;
        width: 7.5rem;
        height: 1.125rem;
        line-height: 1.125rem;
      }
    }
  }
}
</style>