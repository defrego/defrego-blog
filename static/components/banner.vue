<template>
  <div class="banner">
    <div class="bannerBlock" v-show="!bMinimal" :style="{'background-image': `url('${bannerImg}')`}">
      <div class="logo" @click="jumpToHome"></div>
      <h1 class="title">
        {{title}}
      </h1>
      <h4 class="tags">{{tags}}</h4>
    </div>
    <div class="bannerInner minimal" v-show="bMinimal" :style="{'background-image': `url('${bannerImg}')`}">
      <div class="logo" @click="jumpToHome"></div>
      <h1 class="title">
        {{title}}
      </h1>
      <h4 class="tags">{{tags}}</h4>
    </div>
  </div>
</template>

<script>
let decisionHeight
let screenWidth = window.screen.width
if (screenWidth <= 400) {
  decisionHeight = 300
} else if (screenWidth <= 600) {
  decisionHeight = 240
} else {
  decisionHeight = 330
}
export default {
  name: 'banner',
  data() {
    return {
      bMinimal: false
    }
  },
  props: {
    bannerInfo: Object,
    bannerImg: String
  },
  computed: {
    bannerImg() {
      return this.bannerInfo.titleImgSrc || '/image/banner.jpg'
    },
    title() {
      return this.bannerInfo.title || 'Take What You Can And Give Nothing Back'
    },
    tags() {
      return this.bannerInfo.tags
    }
  },
  methods: {
    jumpToHome() {
      document.location.href = '/'
    },
    offsetChange() {
      let offset = document.documentElement.scrollTop || document.body.scrollTop
      if (this.bMinimal !== (offset > decisionHeight)) {
        this.bMinimal = !this.bMinimal
        this.$emit('bMinimal', this.bMinimal)
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.offsetChange)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.offsetChange)
  }
}
</script>

<style lang="less" scoped>
</style>
