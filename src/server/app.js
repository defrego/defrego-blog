/* 每次上传前要的的有mongodb端口和saveFiles的图片目录 */
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const router = require('koa-router')()
const bodyParser = require('koa-body')({multipart: true})
const mongoose = require('mongoose')
const _ = require('lodash')
mongoose.Promise = global.Promise
const app = new Koa()

let SessionId = ''
let Tik = null

let db = mongoose.createConnection('mongodb://localhost:30017/general')
let articleSchema = new mongoose.Schema({
  title: String,
  tags: Array,
  description: String,
  content: String,
  titleImgSrc: String,
  imgFiles: Object,
  postTime: {type: Date, default: Date.now()},
  visited: Number,
  likes: Number,
  dislikes: Number,
  comments: [{content: String, date: Date}]
})
let adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  level: String
})

let articleModel = db.model('articles', articleSchema)
let adminModel = db.model('admins', adminSchema)

function getContent (title) {
  return articleModel.findOne({
    'title': title
  })
}
function searchBy (condition) {
  let q = {}
  if (!_.isPlainObject(condition)) {
    let keyWord = condition['tags'] ? condition['tags'].split(',') : []
    q = {
      tags: { $all: keyWord }
    }
  }
  return articleModel.find(q).select('title tags description titleImgSrc postTime visited likes dislikes')
}
function add (req) {
  let article = new articleModel({
    title: req.title || 'default title',
    tags: req.tags || ['default tag'],
    description: req.description || 'no description',
    content: req.content || 'default content a b c',
    titleImgSrc: req.titleImgSrc || '/image/banner.jpg',
    imgFiles: req.imgFiles || {},
    postTime: req.postTime || Date.now(),
    visited: req.visited || 0,
    likes: req.likes || 0,
    dislikes: req.dislikes || 0,
    comments: req.comments || [{content: 'nothing', data: Date.now()}]
  })
  return article.save()
}
async function del (req) {
  if (req['title'] === undefined) {
    return null
  }
  let answer = await getContent(req.title)
  let arr = answer.content.match(/\[.*\]\(image\/(.*)\)/g) || []
  arr.concat([answer.titleImgSrc])
  console.log(arr)
  arr.forEach(item => {
    deleteFile(item.slice(item.indexOf('image/') + 6, -1))
  })
  return articleModel.findOneAndRemove({
    'title': req.title
  })
}
function update (req) {
  if (req['title'] === undefined) {
    return null
  }
  return articleModel.update({
    'title': req.title
  }, req)
}
function deleteFile (filename) {
  let delPath = path.join(__dirname, '..', 'static/image', filename)
  fs.unlink(delPath, (err) => {
    if (err) {
      throw err
    }
    console.log('delete complete: ' + delPath)
  })
}
function saveFiles (req) {
  if (_.isEmpty(req)) {
    return null
  }
  let res = {}
  for (let key in req) {
    console.log(key)
    let file = req[key]
    console.log(file)
    let filename = (new Date()).getTime() + file.name.slice(file.name.lastIndexOf('.'))
    let destPath = path.join(__dirname, '..', 'static/image', filename)
    const reader = fs.createReadStream(file.path)
    const writer = fs.createWriteStream(destPath)
    fs.rename(file.path, destPath, err => {
      if (err) throw err
    })
    res[key] = 'image/' + filename
  }
  return res
}
function validate (user, pass) {
  let user_Base64 = new Buffer(user).toString('base64')
  let pass_Base64 = new Buffer(pass).toString('base64')
  return adminModel.find({username: user_Base64}).then(res => {
    if (res.length <= 0) {
      return false
    }
    return res[0].password === pass_Base64
  }).catch(err => {
    return false
  })
}
function modifyAdmins (req) {
  if (req['oldName'] === undefined || req['oldPass'] === undefined || req['newName'] === undefined || req['newPass'] === undefined) {
    return null
  }
  return validate(req.oldName, req.oldPass).then(res => {
    if (res) {
      return adminModel.update({
        'username': new Buffer(req.oldName).toString('base64'),
        'password': new Buffer(req.oldPass).toString('base64')
      }, {
        'username': new Buffer(req.newName).toString('base64'),
        'password': new Buffer(req.newPass).toString('base64')
      })
    } else {
      return false
    }
  }).catch(err => {
    return false
  })
}
function handleErr (e, ctx) {
  console.log(e)
  return false
}
function createError (ctx, errorCode, content) {
  ctx.response.status = errorCode || 404
  if (content) {
    ctx.body = content
  }
  return ctx
}

function resetTik () {
  clearTimeout(Tik)
  Tik = setTimeout(function () {
    SessionId = ''
  }, 5*60*1000)
}

router
  .prefix('/data')
  .get('article', '/article/:title', async (ctx, next) => {
    try {
      let res = await getContent(ctx.params.title)
      ctx.body = res
      return next()
    } catch (e) { handleErr(e, ctx) }
  })
  .get('search', '/search', async (ctx, next) => {
    try {
      let res = await searchBy(ctx.request.query)
      ctx.body = res
      return next()
    } catch (e) { handleErr(e, ctx) }
  })
  .post('addOne', '/addOne', async (ctx, next) => {
    try {
      if (SessionId === '' || ctx.cookies.get('sessionId') !== SessionId) {
        return next(createError(ctx, 401, 'Access Denied'))
      }

      let res = await add(ctx.request.body)
      ctx.body = 'add success'
      return next()
    } catch (e) { handleErr(e, ctx) }
  })
  .post('delOne', '/delOne', async (ctx, next) => {
    try {
      if (SessionId === '' || ctx.cookies.get('sessionId') !== SessionId) {
        return next(createError(ctx, 401, 'Access Denied'))
      }

      let res = await del(ctx.request.body)
      if (_.isNull(res)) {
        handleErr('delete error: no matched item', ctx)
      } else {
        ctx.body = 'delete success'
        return next()
      }
    } catch (e) { handleErr(e, ctx) }
  })
  .post('updateOne', '/updateOne', async (ctx, next) => {
    try {
      if (SessionId === '' || ctx.cookies.get('sessionId') !== SessionId) {
        return next(createError(ctx, 401, 'Access Denied'))
      }

      let res = await update(ctx.request.body)
      if (_.isNull(res)) {
        handleErr('update error: no matched item', ctx)
      } else {
        ctx.body = res
        return next()
      }
    } catch (e) { handleErr(e, ctx) }
  })
  .post('updateImg', '/updateImg', async (ctx, next) => {
    try {
      if (SessionId === '' || ctx.cookies.get('sessionId') !== SessionId) {
        return next(createError(ctx, 401, 'Access Denied'))
      }

      let res = await saveFiles(ctx.request.body.files)
      if (_.isNull(res)) {
        handleErr('update error: no matched item', ctx)
      } else if (!res) {
        handleErr('image save error', ctx)
      } else {
        ctx.body = res
        return next()
      }
    } catch (e) { handleErr(e, ctx) }
  })
  .post('modifyAdmins', '/modifyAdmins', async (ctx, next) => {
    try {
      if (SessionId === '' || ctx.cookies.get('sessionId') !== SessionId) {
        return next(createError(ctx, 401, 'Access Denied'))
      }

      let res = await modifyAdmins(ctx.request.body)
      if (_.isNull(res)) {
        handleErr('modify error: no matched user', ctx)
      } else if (res) {
        ctx.body = 'modify success'
        return next()
      } else {
        handleErr('modify false', ctx)
      }
    } catch (e) { handleErr(e, ctx) }
  })
  .post('login', '/login', async (ctx, next) => {
    try {
      let username = ctx.request.body.username
      let password = ctx.request.body.password
      if (!username || !password) {
        return next(createError(ctx, 401, 'Access Denied'))
      }
      let res = await validate(username, password)
      
      if (res) {
        SessionId = Math.random().toString().slice(2)
        ctx.body = 'login success'
        ctx.cookies.set('sessionId', SessionId)
        resetTik()
      } else {
        return next(createError(ctx, 401, 'Access Denied'))
      }
    } catch (e) { handleErr(e, ctx) }
  })
  .post('logout', '/logout', async (ctx, next) => {
    try {
      let d = new Date().getTime()
      let expiresTime = new Date(d - 60 * 1000 * 24)
      ctx.cookies.set('sessionId', '', {expires: expiresTime})
      SessionId = ''
      ctx.body = 'logout complete'
      clearTimeout(Tik)
      return next()
    } catch (e) { handleErr(e, ctx) }
  })
  .post('heartBeat', '/heartBeat', async (ctx, next) => {
    try {
      if (SessionId === '' || ctx.cookies.get('sessionId') !== SessionId) {
        let d = new Date().getTime()
        let expiresTime = new Date(d - 60 * 1000 * 24)
        ctx.cookies.set('sessionId', '', {expires: expiresTime})
        SessionId = ''
        return next(createError(ctx, 401, 'Access Denied'))
      } else {
        resetTik()
        ctx.body = 'login ok'
        return next()
      }
    } catch (e) { handleErr(e, ctx) }
  })


app
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)
console.log("Server started and listen on port 3000")
