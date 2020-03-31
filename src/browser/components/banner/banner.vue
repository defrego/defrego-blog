<template>
  <div class="banner">
    <div class="bannerBlock defaultBgImg" v-show="!bMinimal" :style="style">
      <img class="logo" @click="jumpToHome" src="./logo.svg" />
      <h1 class="title">
        {{title}}
      </h1>
      <h4 class="tags">{{tags}}</h4>
    </div>
    <div class="bannerInner minimal defaultBgImg" v-show="bMinimal" :style="style">
      <img class="logo" @click="jumpToHome" src="./logo.svg" />
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
      return this.bannerInfo.titleImgSrc;
    },
    style() {
      let res = {};
      if (this.bannerImg) {
        res['background-image'] = `url('${this.bannerImg}')`;
      }
      return res;
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
.defaultBgImg {
  background-image: url('./banner.jpg');
}
</style>
