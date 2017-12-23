<template>
	<div class="edit-form">
    <div class="params">
    	<div class="left">
    		<div>
      		<span>标题图片</span>
      		<input v-model="editFormParam.titleImgSrc" type="text" :disabled="srcDisable">
      		<input type="file" @change="selectFile">
      	</div>
    		<div><span>标题</span><input v-model="editFormParam.title" type="text"></div>
        <div><span>标签</span><input v-model="editFormParam.tags"  type="text"></div>
        <div><span>描述</span><input v-model="editFormParam.description" type="area"></div>
    	</div>
    	<div class="right">
    		<div><span>访问量</span><input v-model="editFormParam.visited" type="text" disabled></div>
        <div><span>喜欢</span><input v-model="editFormParam.likes" type="text" disabled></div>
        <div><span>讨厌</span><input v-model="editFormParam.dislikes" type="text" disabled></div>
        <div><span>提交时间</span><input v-model="editFormParam.postTime" type="text" disabled></div>
    	</div>
    	<div class="clear"></div>
    </div>
    <div class="handle">
    	<span><button @click="submit">提交</button></span>
    	<span><button @click="abandom">放弃修改</button></span>
    </div>
    <div class="content">
      <mavon-editor ref="mavon-editor" v-model="content" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
    </div>
	</div>
</template>

<script>
import each from 'lodash/each'
import merge from 'lodash/merge'
import padStart from 'lodash/padStart'
import isEmpty from 'lodash/isEmpty'

export default {
	name: 'edit-form',
	data() {
		return {
			content: '',
			imgFiles: {},
      editFormParam: this.value
		}
	},
	props: {
		value: Object,
		editMode: String
	},
	computed: {
		srcDisable() {
			return this.imgFiles['tImageLink'] !== undefined
		}
	},
	methods: {
		abandom() {
			this.$emit('abandom')
		},
		addOne() {
      this.$el.querySelector('input[type="file"]').value = ''
      this.imgFiles = {}
      this.content = ''
      this.imgEmpty(this.imgFiles)
		},
		updateOne() {
      this._getContent(this.editFormParam.title).then(res => {
        this.$el.querySelector('input[type="file"]').value = ''
        this.imgFiles = {}
        this.content = res.data.content
        this.imgEmpty(this.imgFiles)
      }, err => {
        console.log(err)
      })
		},
		selectFile() {
      let $file = this.$el.querySelector('input[type="file"]').files
      if ($file.length > 0) {
      	this.$set(this.imgFiles, 'tImageLink', $file[0])
      } else {
      	this.$set(this.imgFiles, 'tImageLink', undefined)
      }
    },
    imgAdd(pos, $file) {
      this.imgFiles[pos] = $file
    },
    imgDel(pos) {
      delete this.imgFiles[pos]
    },
    imgEmpty(imgFiles, $vm) {
      let that = this
      each(imgFiles, (item, key) => {
        that.$refs['mavon-editor'].$refs.toolbar_left.$imgDelByFilename(key)
      })
    },
    submit() {
      let url = ''
      if (this.editMode === 'add') {
        url = '/data/addOne'
      } else if (this.editMode === 'update') {
        url = '/data/updateOne'
      } else {
        return false
      }
      this._submitImg(this.imgFiles).then(res => {
        let content = this.content
        for(let name in res.data) {
          if (name === 'tImageLink') {
            this.editFormParam.titleImgSrc = res.data[name]
          } else {
            let regx = new RegExp('\]\\(' + name + '\\)', 'g')
            content = content.replace(regx, '](' + res.data[name] + ')')
          }
        }
        let date = new Date()
        let time = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' '
                 + padStart(date.getHours(), 2, '0') + ':' + padStart(date.getMinutes(), 2, '0') + ':' + padStart(date.getSeconds(), 2, '0')
        return merge({}, this.editFormParam, {
          postTime: time,
          content: content
        })
      }).then(data => {
        return this.$http.post(url, data).then(res => {
        	this.$emit('saveOK')
        })
      }).catch(err => {
        console.log(err)
        this.$router.push('/backendLogin')
      })
    },
    _getContent(title) {
      return this.$http.get(`/data/article/${title}`)
    },
    _submitImg(files) {
      /* files = {name1: $file1, name2: $file2} */
      /* res = {name1: $file1_path, name2: $file2_path }*/
      if (isEmpty(files)) {
        // 不用上传图片则返回一个return 空{}的promise
        return (new Promise((resolve, reject) => {
          resolve({data: {}})
        }))
      }
      let formdata = new FormData()
      for(let name in files){
         formdata.append(name, files[name])
      }
      return this.$http.post('data/updateImg', formdata)
    }
	}
}
</script>

<style lang="less" scoped>
.edit-form {
  margin-top: 20px;
  .params {
  	min-width: 820px;
  	.left {
  		width: 60%;
  		float: left;
  	}
  	.right {
  		eidth: 35%;
  		float: left;
  	}
    .left > div,
    .right > div {
      margin: 5px 0;
      text-align: left;
      span {
        display: inline-block;
        width: 80px;
        float: left;
      }
      input, select {
        width: 160px;
      }
    }
  }
  .handle {
  	text-align: right;
  	margin: 20px 0 5px;
  	button {
  		width: 100px;
  		&:hover {
  			cursor: pointer;
  		}
  	}
  }
  .content {
    margin: 0 0 100px
  }
}
.clear {
	clear: both;
}
</style>