<template>
  <div class="detailPage">
    <div>
      <mavon-editor v-model="content"
                    :toolbarsFlag="false"
                    :subfield="false"
                    :shortCut="false"
                    :imageClick="imageClick"
                    defaultOpen="preview"></mavon-editor>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detailPage',
  data() {
    return {
      title: '',
      tags: [],
      description: '',
      content: '',
      titleImgSrc: '',
      postTime: '',
      visited: 0,
      likes: 0,
      dislikes: 0,
      comments: []
    }
  },
  methods: {
    imageClick() {}
  },
  created() {
    this.$http.get(`/data/article/${this.$route.params.title}`).then(res => {
      this.title = res.data.title,
      this.tags = res.data.tags.join(', '),
      this.description = res.data.description,
      this.content = res.data.content,
      // this.content = mavonEditor.markdownIt.render(res.data.content),
      this.titleImgSrc = res.data.titleImgSrc,
      this.postTime = res.data.postTime,
      this.visited = res.data.visited,
      this.likes = res.data.likes,
      this.dislikes = res.data.dislikes,
      this.comments = res.data.comments
      this.$emit('bannerInfo', {
        title: this.title,
        tags: this.tags,
        titleImgSrc: this.titleImgSrc
      })
      document.title = res.data.title
      let arr = document.head.querySelectorAll('meta')
      for (let i=0; i<arr.length; i++) {
        if (arr[i].getAttribute('name') === 'keywords') {
          arr[i].setAttribute('content', res.data.tags.join(','))
        } else if (arr[i].getAttribute('name') === 'description') {
          arr[i].setAttribute('content', res.data.description)
        }
      }
    }, err => {
      console.log(err)
    })
  }
}
</script>

<style lang="less">
.detailPage {
  .content {
    background-color: #f3fafc;
  }
}
</style>