<template>
  <div class="backendManage">
    <div class="nav">
      <div>
        <span class="logo" @click="jumpToHome"></span>
        <span>Defrego's Blog</span>
      </div>
      <ul>
        <li @click="logout">退出</li>
        <li @click="manageArticle">文章管理</li>
        <li @click="manageUser">用户管理</li>
      </ul>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'backendManage',
  data() {
    return {
      interval: null
    }
  },
  methods: {
    jumpToHome() {
      document.location.href = '/'
    },
    manageArticle() {
      this.$router.push('manageArticle')
    },
    manageUser() {
      this.$router.push('manageUser')
    },
    logout() {
      let d = new Date()
      d.setTime((new Date()).getTime() + (-1 * 24 * 60 * 60 * 1000))
      document.cookie = "bLogin=false;expires=" + d.toGMTString()
      this.$http.post('/data/logout')
      this.$router.push('/backendLogin')
    }
  },
  created() {
    this.interval = setInterval(() => {
      this.$http.post('/data/heartBeat').then(res => {
      }).catch(() => {
        let d = new Date()
        d.setTime((new Date()).getTime() + (-1 * 24 * 60 * 60 * 1000))
        document.cookie = "bLogin=false;expires=" + d.toGMTString()
        this.$router.push('/backendLogin')
      })
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
    this.logout()
  }
}
</script>

<style lang="less">
.backendManage {
  width: 100%;
  height: 100%;
  position: relative;
  .nav {
    width: 200px;
    height: 100%;
    position: fixed;
    background-color: #dcdcdc;
    div {
      height: 100px;
      line-height: 100px;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .logo {
        &:hover {
          transform: rotate(360deg);
          transition: transform 0.4s;
          cursor: pointer;
          opacity: 0.6
        }
        transform: rotate(0);
        transition: transform 0.4s;
        width: 64px;
        height: 64px;
        background-image: url('../assets/logo.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }
    }
    ul {
      list-style: none;
      height: 100%;
      padding: 20px 10px 0;
      margin: 0;
      li {
        display: inline-block;
        width: 100%;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
        &:hover {
          background-color: #cccccc;
          cursor: pointer;
        }
      }
    }
  }
  .content {
    margin-left: 200px;
    padding: 16px;
  }
}
</style>