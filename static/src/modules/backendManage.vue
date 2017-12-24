<template>
  <div class="backendManage">
    <br/>
    <button @click="logout" style="float: right">退出</button>
    <button @click="bModifyAdmin = !bModifyAdmin" style="float: right; margin-right: 5px;">修改用户名密码</button>
    <br/>
    <modify-admin v-show="bModifyAdmin" @modify="modifyAuth"></modify-admin>
    <item-list ref="itemList"
               v-show="!editMode"
               :itemList="itemList"
               :tips="tips"
               :tipColor="tipColor"
               @refresh="refresh"
               @addOne="addOne"
               @updateOne="updateOne"
               @delOne="delOne"></item-list>
    <edit-form ref="editForm"
               v-show="editMode === 'add' || editMode === 'update'"
               v-model="editFormParam"
               :editMode="editMode"
               @saveOK="saveOK"
               @abandom="editMode = false"></edit-form>
    <br/>
  </div>
</template>

<script>
import each from 'lodash/each'
import merge from 'lodash/merge'
import editForm from '../components/edit-form'
import itemList from '../components/item-list'
import modifyAdmin from '../components/modify-admin'

export default {
  name: 'backendManage',
  data() {
    return {
      bModifyAdmin: false,
      tips: '',
      tipColor: '',
      interval: null,
      itemList: [{
        title: '',
        tags: [],
        titleImgSrc: '',
        description: '',
        postTime: '',
        visited: 0,
        likes: 0,
        dislikes: 0
      }],
      editMode: false,
      editFormParam: {
        title: '',
        tags: [],
        titleImgSrc: '',
        description: '',
        postTime: '',
        visited: 0,
        likes: 0,
        dislikes: 0
      }
    }
  },
  methods: {
    modifyAuth(req) {
      this._modifyAuth({
        oldName: req.username,
        oldPass: req.password,
        newName: req.newName,
        newPass: req.newPass
      }).then(() => {
        alert('修改成功！')
        this.bModifyAdmin = false
      }).catch(() => {
        alert('修改失败！')
      })
    },
    refresh() {
      this._search().then(() => {
        this.tips = '刷新成功'
        this.tipColor = 'green'
        setTimeout(() => { this.tips = '' }, 1500)
      }).catch(() => {
        this.tips = '刷新失败'
        this.tipColor = 'red'
        setTimeout(() => { this.tips = '' }, 2000)
      })
    },
    addOne() {
      this.editMode = 'add'
      merge(this.editFormParam, {
        title: '',
        tags: [],
        titleImgSrc: '',
        description: '',
        postTime: '待定',
        visited: 0,
        likes: 0,
        dislikes: 0
      })
      this.editFormParam.tags.splice(0)
      this.$refs.editForm.addOne()
    },
    updateOne(index) {
      this.editMode = 'update'
      merge(this.editFormParam, this.itemList[index])
      this.$refs.editForm.updateOne()
    },
    delOne(title, index) {
      this._delete(title).then(res => {
        this.tips = '删除成功'
        this.tipColor = 'green'
        this.itemList.splice(index, 1)
        setTimeout(() => { this.tips = '' }, 2000)
      }, err => {
        this.tips = '删除失败'
        this.tipColor = 'red'
        setTimeout(() => { this.tips = '' }, 2000)
      })
    },
    saveOK() {
      this.editMode = false
      this._search()
    },
    _search() {
      return this.$http.get('/data/search').then(res => {
        this.itemList.splice(0)
        each(res.data, (item, key) => {
          this.itemList.push({
            title: item.title,
            tags: item.tags,
            titleImgSrc: item.titleImgSrc,
            description: item.description,
            postTime: item.postTime,
            visited: item.visited,
            likes: item.likes,
            dislikes: item.dislikes
          })
        })
      }, err => {
        console.log(err)
      })
    },
    _delete(title) {
      return this.$http.post('/data/delOne', {'title': title})
    },
    _modifyAuth(req) {
      return this.$http.post('/data/modifyAdmins', req)
    },
    logout() {
      let d = new Date()
      d.setTime((new Date()).getTime() + (-1 * 24 * 60 * 60 * 1000))
      document.cookie = "bLogin=false;expires=" + d.toGMTString()
      this.$http.post('/data/logout')
      this.$router.push('/backendLogin')
    }
  },
  components: {editForm, itemList, modifyAdmin},
  created() {
    this._search()
    this.interval = setInterval(() => {
      this.$http.post('/data/heartBeat').then(res => {
      }).catch(() => {
        let d = new Date()
        d.setTime((new Date()).getTime() + (-1 * 24 * 60 * 60 * 1000))
        document.cookie = "bLogin=false;expires=" + d.toGMTString()
        this.$router.push('/backendLogin')
      })
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
    this.logout()
  }
}
</script>

<style lang="less">
.backendManage {
  width: 90%;
  margin: 0 auto;
}
</style>