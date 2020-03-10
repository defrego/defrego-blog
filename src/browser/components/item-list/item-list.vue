<template>
  <div class="item-list">
    <div class="itemTableTitle">
      <span>文章列表</span>
      <span><button @click="addOne">新增</button></span>
      <span><button @click="refresh">刷新</button></span>
      <span :style="{color: tipColor}">{{tips}}</span>
    </div>
    <div class="itemTable">
      <div class="item">
        <span class="normal">标题</span>
        <span class="normal">标签</span>
        <span class="long">描述</span>
        <span class="short">提交时间</span>
        <span class="number">访问量</span>
        <span class="number">喜欢</span>
        <span class="number">讨厌</span>
      </div>
      <div v-for="(item, index) in itemList" :key="item.title" class="item">
        <span class="normal" :title="item.title">{{item.title}}</span>
        <span class="normal" :title="item.tags">{{item.tags}}</span>
        <span class="long" :title="item.description">{{item.description}}</span>
        <span class="short" :title="item.postTime">{{(item.postTime).slice(0, 19).replace('T', ' ')}}</span>
        <span class="number" :title="item.visited">{{item.visited}}</span>
        <span class="number" :title="item.likes">{{item.likes}}</span>
        <span class="number" :title="item.dislikes">{{item.dislikes}}</span>
        <span class="handle"><button @click="updateOne(index)">update</button></span>
        <span class="handle"><button @click="delOne(item.title, index)">delete</button></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-list',
  data() {
    return {
    }
  },
  props: {
    itemList: Array,
    tips: String,
    tipColor: String
  },
  methods: {
    refresh() {
      this.$emit('refresh')
    },
    addOne() {
      this.$emit('addOne')
    },
    delOne(title, index) {
      this.$emit('delOne', title, index)
    },
    updateOne(index) {
      this.$emit('updateOne', index)
    },
  }
}
</script>

<style lang="less" scoped>
.item-list {
  .itemTableTitle {
    margin-top: 1.25rem;
    height: 1.875rem;
    line-height: 1.875rem;
    span {
      display: inline-block;
      float: left;
      button {
        width: 6.25rem;
        margin: 0.25rem 0 0.25rem 0.625rem;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .itemTable {
    width: 71.25rem;
    max-height: 37.5rem;
    border: 1px solid black;
    border-bottom: none;
    overflow-y: scroll;
    .item {
      border-bottom: 1px solid black;
      height: 1.625rem;
      line-height: 1.625rem;
      span {
        height: 100%;
        display: inline-block;
        border-right: 1px solid black;
        float: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        &.handle {
          width: 3.75rem;
          border-right: none;
        }
        &.number {
          width: 3.125rem;
        }
        &.short {
          width: 11.25rem;
        }
        &.normal {
          width: 11.25rem;
        }
        &.long {
          width: 18.75rem;
        }
      }
    }
  } 
}
</style>
