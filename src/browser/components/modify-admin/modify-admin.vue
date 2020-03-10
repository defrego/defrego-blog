<template>
  <div class="modifyAdmin">
    <div class="content">
      <div><label>用户名</label><input v-model="c_username" type="text" /><h5>{{usernameTips}}</h5></div>
      <div><label>密 码</label><input v-model="c_password" type="text" /><h5>{{passwordTips}}</h5></div>
      <div><label>新用户名</label><input v-model="c_newName" type="text" /><h5>{{newNameTips}}</h5></div>
      <div><label>新密码</label><input v-model="c_newPass" type="text" /><h5>{{newPassTips}}</h5></div>
      <div><label>新密码确认</label><input v-model="c_newPassConfirm" type="text" /><h5>{{newPassConfirmTips}}</h5></div>
      <div><button @click="modify">新密码确认</button></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modifyAdmin',
  data() {
    return {
      username: 'default',
      password: 'default',
      newName: 'default',
      newPass: 'default',
      newPassConfirm: 'default',
      usernameTips: '',
      passwordTips: '',
      newNameTips: '',
      newPassTips: '',
      newPassConfirmTips: '',
    }
  },
  computed: {
    c_username: {
      get() {
        return this.username
      },
      set(val) {
        this.username = val
        this.validate('username', val)
      }
    },
    c_password: {
      get() {
        return this.password
      },
      set(val) {
        this.password = val
        this.validate('password', val)
      }
    },
    c_newName: {
      get() {
        return this.newName
      },
      set(val) {
        this.newName = val
        this.validate('newName', val)
      }
    },
    c_newPass: {
      get() {
        return this.newPass
      },
      set(val) {
        this.newPass = val
        this.validate('newPass', val)
      }
    },
    c_newPassConfirm: {
      get() {
        return this.newPassConfirm
      },
      set(val) {
        this.newPassConfirm = val
        if (val !== this.newPass) {
          this.newPassConfirmTips = 'two new password is not the same'
        } else {
          this.newPassConfirmTips = ''
        }
      }
    },
  },
  methods: {
    validate(key, val) {
      if (!val || !(/^[A-Za-z0-9]{3,}$/.test(val))) {
        this[key+'Tips'] = `${key} should be consist of a-z、A-Z、0-9 and longger than 3`
        return false
      } else {
        this[key+'Tips'] = ''
        return true
      }
    },
    modify() {
      let res = true
      let arr = ['username', 'password', 'newName', 'newPass']
      arr.forEach(item => {
        if (!this.validate(item, this[item])) {
          res = false
        }
      })
      if (this.newPass !== this.newPassConfirm) {
        res = false
        this.newPassConfirmTips = 'two new password is not the same'
      } else {
        this.newPassConfirmTips = ''
      }
      if (res) {
        this.$emit('modify', {
          username: this.username,
          password: this.password,
          newName: this.newName,
          newPass: this.newPass
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.modifyAdmin {
  .content {
    width: 31.25rem;
    margin: 0.625rem auto;
    div {
      text-align: left;
      margin: 0.313rem 0;
      label {
        display: inline-block;
        width: 6.25rem;
        vertical-align: top;
      }
      input {
        display: inline-block;
        width: 11.25rem;
        vertical-align: top;
      }
      h5 {
        display: inline-block;
        margin-left: 0.625rem;
        width: 12.5rem;
        vertical-align: top;
        color: red;
      }
    }
  }
}
</style>