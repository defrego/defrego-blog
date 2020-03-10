<template>
  <div class="homePage">
    <card v-for="item in cardlist"
          :key="item.title"
          :title="item.title"
          :postTime="item.postTime"
          :tags="item.tags"
          :titleImgSrc="item.titleImgSrc"
          @click="jumpToDetail"></card>
  </div>
</template>

<script>
import card from '@components/card'
import each from 'lodash/each'
import orderBy from 'lodash/orderBy'
document.title = 'defrego\'s blog'
let arr = document.head.querySelectorAll('meta')
for (let i=0; i<arr.length; i++) {
  if (arr[i].getAttribute('name') === 'keywords') {
    arr[i].setAttribute('content', 'defrego,javascript,js,frontend,website')
  } else if (arr[i].getAttribute('name') === 'description') {
    arr[i].setAttribute('content', 'defrego的个人博客，记录前端学习中的点点滴滴和生活趣事，Take What You Can And Give Nothing Back')
  }
}
export default {
  name: 'homePage',
  data() {
    return {
      cardlist: [
        {
          title: 'article 1',
          postTime: '2017-11-11',
          titleImgSrc: ''
        }
      ]
    }
  },
  methods: {
    jumpToDetail(title) {
      this.$emit('click', title)
    }
  },
  components: { card },
  created() {
    let that = this
    this.$emit('bannerInfo', {
      titleImgSrc: undefined,   // 使用默认的背景图
    })
    this.$http.get('/data/search').then(res => {
      let arr = []
      each(res.data, (item, key) => {
        arr.push({
          title: item.title,
          postTime: item.postTime,
          tags: item.tags,
          titleImgSrc: item.titleImgSrc
        })
      })
      arr = orderBy(arr, ['postTime'], ['desc'])
      that.cardlist.splice(0, that.cardlist.length, ...arr)
    }, err => {
      console.log(err)
    })
  }
}
</script>

<style lang="less" scoped>
</style>