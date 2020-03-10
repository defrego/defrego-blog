<template>
  <div id="main">
    <banner :bannerInfo="bannerInfo" @bMinimal="changeMinimal" @dblclick.native="scrollToTop"></banner>
    <router-view @click="jumpToDetail" @bannerInfo="bannerInfoChange"></router-view>
    <foot></foot>
    <transition name="fade">
      <div class="scroll-to-top" v-show="showArrow" @mouseover="showFoot = true" @mouseout="showFoot = false" @click="scrollToTop"></div>
    </transition>
  </div>
</template>

<script>
import banner from '@components/banner'
import foot from '@components/foot'
export default {
  name: 'main',
  data () {
    return {
      bannerInfo: {
        title: '',
        tags: [],
        titleImgSrc: ''
      },
      showFoot: false,
      showArrow: false
    }
  },
  methods: {
    jumpToDetail(title) {
      this.$router.push(`/detailPage/${title}`)
    },
    bannerInfoChange(info) {
      this.$set(this, 'bannerInfo', info)
    },
    scrollToTop() {
      this.showFoot = false
      window.scrollTo(0, 0)
    },
    changeMinimal(val) {
      this.showArrow = val
    }
  },
  components: { banner, foot },
  created() {
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less">
</style>
