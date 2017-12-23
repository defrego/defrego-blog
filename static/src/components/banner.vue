<template>
  <div class="banner">
    <div class="bannerBack"></div>
    <div class="bannerInner" :class="{'minimal': bMinimal}" :style="style">
      <div class="logo" @click="jumpToHome"></div>
      <h1 class="title">
        Take What You Can And Give Nothing Back
      </h1>
      <!-- <span class="manageDoor" @click="manageDoor">to managePage</span> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'banner',
  data() {
    return {
      bannerHeight: 0,
      currentOffset: 0
    }
  },
  computed: {
    // return false ==> 'normal';   true ==> 'minimal'
    bMinimal() {
      if (this.switchHeight !== undefined) {
        if (this.bannerInnerHeight < this.switchHeight) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    bannerInnerHeight() {
      return this.bannerHeight - this.currentOffset
    },
    bannerInnerTop() {
      return this.bMinimal ? 0 : `${this.currentOffset}px`
    },
    style() {
      return {
        'background-image': `url('${this.bannerImg}')`,
        'height': this.bannerInnerHeight + 'px',
        'top': this.bannerInnerTop
      }
    }
  },
  watch: {
    bMinimal(newval, oldval) {
      this.$emit('bMinimal', newval)
    }
  },
  props: {
    bannerImg: String,
    switchHeight: Number
  },
  methods: {
    jumpToHome() {
      document.location.href = '/'
    },
    manageDoor() {
      document.location.href = '/backend.html'
    },
    reportHeight() {
      this.bannerHeight = this.$el.offsetHeight
    },
    reportOffset() {
      this.currentOffset = document.documentElement.scrollTop || document.body.scrollTop
    }
  },
  mounted() {
    setTimeout(() => {
      this.reportHeight()
      this.reportOffset()
      this.$emit('bMinimal', this.bMinimal)
    }, 100)
    if (this.switchHeight !== undefined) {
      window.addEventListener('resize', this.reportHeight)
      window.addEventListener('scroll', this.reportOffset)
    }
  },
  beforeDestroy() {
    if (this.switchHeight !== undefined) {
      window.removeEventListener('resize', this.reportHeight)
      window.removeEventListener('scroll', this.reportOffset)
    }
  }
}
</script>

<style lang="less" scoped>
.banner {
  position: relative;
  width: 100%;
  height: 40%;
}
.bannerBack {
  width: 100%;
  height: 100%;
}
.bannerInner {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  .logo {
    &:hover {
      transform: rotate(360deg);
      transition: transform 0.4s;
      cursor: pointer;
      opacity: 0.6
    }
    transform: rotate(0);
    transition: transform 0.4s;
    position: absolute;
    top: 5%;
    left: 4%;
    width: 64px;
    height: 64px;
    background-image: url('../assets/logo.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .title {
    &:hover {
      cursor: default;
    }
    position: absolute;;
    width: 100%;
    top: 30%;
    color: #ffffff;
    font-size: 2rem;
    text-shadow: 0 1px 1px #000000;
    font-weight: lighter;
    font-family: Exo,'-apple-system','Open Sans',HelveticaNeue-Light,'Helvetica Neue Light','Helvetica Neue','Hiragino Sans GB','Microsoft YaHei',Helvetica,Arial,sans-serif
  }
  .manageDoor {
    &:hover {
      text-decoration: underline;
      color: red;
      cursor: pointer;
    }
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
.minimal {
  position: fixed;
  z-index: 2000;
  top: 0;
  min-height: 80px;
  opacity: 0.8;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
    transition: opacity 0.3s;
  }
  .title {
    font-size: 1.5rem;
  }
}
</style>
