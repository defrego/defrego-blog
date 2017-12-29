<template>
  <div class="card" v-lazy:background-image="imageSrc" @click="jumpToDetail">
    <div class="articleInfo">
      <span class="title" :title="title">{{title}}</span>
      <span class="postTime">{{tags.join(', ')}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  data() {
    return {
    }
  },
  computed: {
    imageSrc() {
      return this.titleImgSrc
    }
  },
  props: {
    title: String,
    tags: {
      type: Array,
      default: []
    },
    titleImgSrc: String
  },
  methods: {
    jumpToDetail() {
      this.$emit('click', this.title)
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 60%;
  margin: 20px 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
  .articleInfo {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 10px 0;
    background-color: #464646;
    color: #fdfdfd;
    opacity: 0.65;
    &:hover {
      opacity: 0.8;
    }
    .title {
      width: 100%;
      display: inline-block;
      text-align: left;
      font-size: 2.3rem;
      margin-left: 20px;
    }
    .postTime {
      width: 100%;
      display: inline-block;
      text-align: left;
      font-size: 1.2rem;
      margin-left: 20px;
    }
  }
}
</style>