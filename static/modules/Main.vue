<template>
  <div id="app">
    <banner :bannerInfo="bannerInfo" @bMinimal="changeMinimal" @dblclick.native="scrollToTop"></banner>
    <router-view @click="jumpToDetail" @bannerInfo="bannerInfoChange"></router-view>
    <transition name="fade">
      <div class="scroll-to-top" v-show="showArrow" @mouseover="showFoot = true" @mouseout="showFoot = false" @click="scrollToTop"></div>
    </transition>
    <div class="foot" v-show="showArrow">
      <span><label @click="toBack" class="extLinks">defrego's blog</label> © {{new Date().getFullYear()}}  Designed by Defrego[<label @click="toGithub" class="extLinks">github</label>] <label class="backInfo">浙ICP备17055010号</label></span><br/>
      <span></span>
    </div>
  </div>
</template>

<script>
import banner from '../components/banner.vue'
export default {
  name: 'app',
  data () {
    return {
      bannerInfo: {
        title: '',
        tags: [],
        titleImgSrc: ''
      },
      bannerImg: '/image/banner.jpg',
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
    },
    toBack() {
      window.open('/backend.html', '_blank')
    },
    toGithub() {
      window.open('https://github.com/defrego/defrego-blog', '_blank')
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
  bottom: 1.875rem;
  right: 3.125rem;
  width: 3.125rem;
  height: 2.5rem;
  opacity: 0.45;
  background-image: url('../assets/arrow-up.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  &:hover {
    opacity: 0.3;
    cursor: pointer;
  }
}
.fade-enter-active {
  opacity: 0.15;
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
  transition: opacity 0.5s;
}
.foot {
  z-index: 2000;
  position: fixed;
  width: 100%;
  height: 1.563rem;
  bottom: -1px;
  text-align: center;
  color: #484848;
  background-color: #d4d4d4;
  .extLinks {
    font-style: italic;
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
}
.banner {
  position: relative;
  width: 100%;
  height: 40%;
  .bannerBlock {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .bannerInner {
    bottom: 0;
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .minimal {
    position: fixed;
    z-index: 2000;
    top: 0;
    height: 5rem;
    .title {
      font-size: 1.5rem;
    }
  }
  .title,
  .tags {
    &:hover {
      cursor: default;
    }
    position: absolute;
    width: 100%;
    top: 30%;
    color: #ffffff;
    font-size: 2rem;
    text-shadow: 0 1px 1px #000000;
    font-weight: lighter;
    font-family: Exo,'-apple-system','Open Sans',HelveticaNeue-Light,'Helvetica Neue Light','Helvetica Neue','Hiragino Sans GB','Microsoft YaHei',Helvetica,Arial,sans-serif
  }
  .tags {
    top: 60%;
    font-size: 1em;
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
    position: absolute;
    top: 5%;
    left: 4%;
    width: 4rem;
    height: 4rem;
    background-image: url('../assets/logo.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}

@media screen and (max-width: 400px) {
  body {
    font-size: 0.5rem;
    overflow-x: hidden;
  }
  .foot {
    height: 1.8rem;
    .backInfo {
      display: inline-block;
    }
  }
  .scroll-to-top {
    bottom: 3rem;
    right: 1.5rem;
    width: 4rem;
    height: 3.5rem;
  }
  .homePage,
  .detailPage {
    width: 98%;
    margin: 1.25rem auto;
  }
  .banner {
    .minimal {
      display: none;
      height: 4rem;
      .title {
        font-size: 0.85rem;
      }
    }
    .logo {
      position: absolute;
      top: 10%;
      left: 2%;
      width: 2.7rem;
      height: 2.7rem;
    }
    .title {
      width: 100%;
      top: 33%;
      font-size: 1.8rem;
    }
  }
}
@media screen and (min-width: 400px) and (max-width: 600px) {
  body {
    font-size: 0.6rem;
    overflow-x: hidden;
  }
  .foot {
    height: 1.4rem;
  }
  .scroll-to-top {
    bottom: 3rem;
    right: 1.5rem;
    width: 4rem;
    height: 3.5rem;
  }
  .homePage,
  .detailPage {
    width: 98%;
    margin: 1.25rem auto;
  }
  .banner {
    .minimal {
      display: none;
      height: 4rem;
      .title {
        font-size: 0.9rem;
      }
    }
    .logo {
      position: absolute;
      top: 10%;
      left: 3%;
      width: 3rem;
      height: 3rem;
    }
    .title {
      width: 100%;
      top: 40%;
      font-size: 2rem;
    }
  }
}
@media screen and (min-width: 600px) {
  body {
    font-size: 0.8rem;
  }
  .homePage,
  .detailPage {
    width: 70%;
    margin: 1.25rem auto;
    .v-note-panel {
      box-shadow: none !important;
      .v-show-content {
        background-color: #ffffff !important;
      }
      img {
        width: 50%;
      }
      
    }
  }
}
</style>
