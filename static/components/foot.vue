<template>
  <div class="foot">
    <div class="image">
      <img src="../assets/website.png">
      <span>手机访问本站</span>
    </div>
    <div class="image">
      <img src="../assets/alipay_QRcode.png">
      <span>支付宝打赏</span>
    </div>
    <div class="image">
      <img src="../assets/wechat_pay_QRcord.png">
      <span>微信打赏</span>
    </div>
    <div>
      <span>
        <label @click="toBack" class="extLinks">defrego's blog</label> © {{new Date().getFullYear()}}  Designed by Defrego[<label @click="toGithub" class="extLinks">github</label>]<br/>
        <label class="backInfo">浙ICP备17055010号</label>
      </span>
      <br/><br/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'foot',
  data() {
    return {}
  },
  methods: {
    toBack() {
      window.open('/backend.html', '_blank')
    },
    toGithub() {
      window.open('https://github.com/defrego/defrego-blog', '_blank')
    }
  }
}
</script>

<style lang="less" scoped></style>