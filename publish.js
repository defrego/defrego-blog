var Path = require('path')
var fs = require('fs')
var client = require('C:/Users/defrego/AppData/Roaming/npm/node_modules/ssh2').Client
var conn = new client()

// 获取当前路径的参数
function stat(sftp, path) {
  return new Promise((resolve, reject) => {
    sftp.stat(path, function(err, Stats) {
      if (err) {
        reject(err)
      } else {
        resolve(Stats)
      }
    })
  })
}
// 读取文件夹的所有子项目
function readdir(sftp, path) {
  return new Promise((resolve, reject) => {
    /* path: 非空文件夹，则list为[{attrs}]
     * path: 空文件夹，则list为[]
     * path: 文件, 则会抛出err
     */
    sftp.readdir(path, function(err, list) {
      if (err) {
        reject(err)
      } else {
        resolve(list)
      }
    })
  })
}
// 删除文件夹及其子文件夹
function rmdir(sftp, path) {
  return new Promise((resolve, reject) => {
    readdir(sftp, path).then(res => {
      if (res.length > 0) {
        // 非空文件夹需要先删除子文件夹
        var todo = []
        var promise_arr = []
        res.forEach(item => {
          var _p = Path.join(path, item.filename).replace(/\\/g, '/')
          todo.push(
            stat(sftp, _p).then(_r => {
              if (_r.isDirectory()) {
                promise_arr.push(rmdir(sftp, _p))
              } else {
                promise_arr.push(rm(sftp, _p))
              }
            })
          )
        })
        Promise.all(todo).then(() => {
          return Promise.all(promise_arr)
        }).then(() => {
          return sftp.rmdir(path, err => {
            if (err) {
              reject(err)
            } else {
              resolve('remove dir \'' + path + '\' complete')
            }
          })
        }).catch(_e => {
          reject(_e)
        })
      } else {
        // 空文件夹直接删除掉
        sftp.rmdir(path, err => {
          if (err) {
            reject(err)
          } else {
            resolve('remove dir \'' + path + '\' complete')
          }
        })
      }
    }).catch(err => {
      if (err.message === 'No such file') {
        resolve('remove dir \'' + path + '\' complete')
      } else {
        reject(err)
      }
    })
  })
}
// 删除文件
function rm(sftp, path) {
  return new Promise((resolve, reject) => {
    sftp.unlink(path, err => {
      if (err) {
        if (err.message === 'No such file') {
          resolve('remove file \'' + path + '\' complete')
        } else {
          reject(err)
        }
      } else {
        resolve('remove file \'' + path + '\' complete')
      }
    })
  })
}
// todo: 1.mkdir/rmdir之前要判断path是否存在
function uploadDir(sftp, src, des) {
  return new Promise((resolve, reject) => {
    sftp.mkdir(des, err => {
      if (err) {
        if (err.message !== 'No such file') {
          reject(err)
        }
      } else {
        fs.readdir(src, (err, files) => {
          if (err) {
            if (err.message.indexOf('no such file') !== -1) {
              resolve('abandon: cannot find \'' + src + '\' in local file system')
            } else {
              reject(err)
            }
          } else {
            if (files.length > 0) {
              var todo = []
              var promise_arr = []
              files.forEach(item => {
                var _p = Path.join(src, item)
                var _t = Path.join(des, item).replace(/\\/g, '/')
                todo.push(
                  fs.stat(_p, (err, stats) => {
                    if (err) {
                      reject(err)
                    } else {
                      if (stats.isDirectory()) {
                        promise_arr.push(uploadDir(sftp, _p, _t))
                      } else {
                        promise_arr.push(upload(sftp, _p, _t))
                      }
                    }
                  })
                )
              })
              Promise.all(todo).then(() => {
                return Promise.all(promise_arr)
              }).then(res => {
                resolve('upload dir to \'' + des + '\' complete')
              }).catch(err => {
                reject(err)
              })
            } else {
              resolve('upload dir to \'' + des + '\' complete')
            }
          }
        })
      }
    })
  })
}
// 上传
function upload(sftp, src, des) {
  return new Promise((resolve, reject) => {
    sftp.fastPut(src, des, err => {
      if (err) {
        if (err.message.indexOf('no such file') !== -1) {
          resolve('abandon: cannot find \'' + src + '\' in local file system')
        } else {
          reject(err)
        }
      } else {
        resolve('upload to \'' + des + '\' complete')
      }
    })
  })
}

conn
.on('ready', () => {
  conn.sftp(function(err, sftp) {
    if (err) throw err
    rmdir(sftp, '/usr/blog/static/assets').then(res => {
      console.log(res)
      return rmdir(sftp, '/usr/blog/static/js')
    }).then(res => {
      console.log(res)
      return rm(sftp, '/usr/blog/static/index.html')
    }).then(res => {
      console.log(res)
      return rm(sftp, '/usr/blog/static/backend.html')
    }).then(res => {
      console.log(res)
      return uploadDir(sftp, './dist/static/assets', '/usr/blog/static/assets/')
    }).then(res => {
      console.log(res)
      return uploadDir(sftp, './dist/static/js', '/usr/blog/static/js')
    }).then(res => {
      console.log(res)
      return upload(sftp, './dist/static/index.html', '/usr/blog/static/index.html')
    }).then(res => {
      console.log(res)
      return upload(sftp, './dist/static/backend.html', '/usr/blog/static/backend.html')
    })
    .then(res => {
      console.log(res)
      return rm(sftp, '/usr/blog/koa/app.js')
    })
    .then(res => {
      console.log(res)
      return upload(sftp, './dist/koa/app.js', '/usr/blog/koa/app.js')
    })
    .then(res => {
      console.log(res)
      return new Promise((resolve, reject) => {
        conn.exec('ps -ef | grep node | grep -v grep | cut -c 9-15 | xargs kill -s 9', (err, stream) => {
          if (err) {
            reject(err)
          } else {
            resolve('stop app.js complete')
          }
        })
      })
    })
    .then(res => {
      console.log(res)
      return new Promise((resolve, reject) => {
        conn.exec('node /usr/blog/koa/app.js', (err, stream) => {
          if (err) {
            reject(err)
          } else {
            resolve('restart app.js complete')
          }
        })
      })
    })
    .then(res => {
      console.log(res)
      conn.end()
    }).catch(err => {
      console.log(err)
      conn.end()
    })
  })
})
.connect({
  host: '127.0.0.1',
  port: 22,
  username: 'abcd',
  password: "1234"
})
