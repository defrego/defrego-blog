<template>
  <div v-show="display" class="loading_component">loading……asdf</div>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {}
  },
  computed: {
    display() {
      return this.state
    }
  },
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    open() {}
  }
}
</script>

<style lang="less" scoped>
.loading_component {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #cccccc;
  opacity: 0.66;
  z-index: 3000;
  padding-top: 30%;
  color: red;
}
</style>
