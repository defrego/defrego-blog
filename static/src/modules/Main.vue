<template>
  <div id="app">
    <banner :switchHeight="80" :bannerImg="bannerImg" @bMinimal="changeMinimal"></banner>
    <router-view @click="jumpToDetail" @bannerImgChang="bannerImgChang"></router-view>
    <transition name="fade">
      <div class="scroll-to-top" v-show="showArrow" @mouseover="showFoot = true" @mouseout="showFoot = false" @click="scrollToTop"></div>
    </transition>
    <transition name="appear">
      <div class="foot" v-show="showFoot">
        <span>defrego's blog © {{new Date().getFullYear()}}  Designed by Defrego 浙ICP备17055010号</span><br/>
        <span></span>
      </div>
    </transition>
    
  </div>
</template>

<script>
import banner from '../components/banner.vue'
export default {
  name: 'app',
  data () {
    return {
      bannerImg: '/image/banner.jpg',
      showFoot: false,
      showArrow: false
    }
  },
  methods: {
    jumpToDetail(title) {
      this.$router.push(`/detailPage/${title}`)
    },
    bannerImgChang(imgSrc) {
      this.bannerImg = imgSrc
    },
    scrollToTop() {
      this.showFoot = false
      window.scrollTo(0, 0)
    },
    changeMinimal(val) {
      this.showArrow = val
    }
  },
  components: { banner },
  created() {
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less">
html, body, #app{
  font-size: 100%;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
h1, h2, h3, h4, h5 {
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.scroll-to-top {
  z-index: 2001;
  position: fixed;
  bottom: 30px;
  right: 50px;
  width: 50px;
  height: 40px;
  opacity: 0.15;
  background-image: url('../assets/arrow-up.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  &:hover {
    opacity: 0.3;
    cursor: pointer;
  }
}
.fade-enter-active, .appear-leave-active {
  opacity: 0.15;
  transition: opacity 0.5s;
}
.fade-enter, .appear-leave-to {
  opacity: 0;
  transition: opacity 0.5s;
}
.foot {
  z-index: 2000;
  position: fixed;
  width: 100%;
  height: 25px;
  bottom: 0;
  text-align: center;
  color: #484848;
  background-color: #d4d4d4;
}
.appear-enter-active, .appear-leave-active {
  opacity: 0.8;
  transition: opacity 0.5s;
}
.appear-enter, .appear-leave-to {
  opacity: 0;
  transition: opacity 0.5s;
}
</style>
