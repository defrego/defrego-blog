<template>
<div class="manageUser">
  <modify-admin @modify="modifyAuth"></modify-admin>
</div>
</template>

<script>
import modifyAdmin from '@components/modify-admin'

export default {
  name: 'manageUser',
  data() {
    return {
    }
  },
  components: {modifyAdmin},
  methods: {
    modifyAuth(req) {
      this._modifyAuth({
        oldName: req.username,
        oldPass: req.password,
        newName: req.newName,
        newPass: req.newPass
      }).then(() => {
        alert('修改成功！')
      }).catch(() => {
        alert('修改失败！')
      })
    },
    _modifyAuth(req) {
      return this.$http.post('/data/modifyAdmins', req)
    }
  }
}
</script>

<style lang="less">
.manageUser {}
</style>