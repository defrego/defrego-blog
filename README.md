# defrego-blog
自己尝试写的一个很简单的博客系统，目前仅拥有最简单的展示功能，<a href="https://defrego.com" target="_blank">展示</a>
### 前端
  - 采用了vueJs做整个框架
  - 文章的编辑和显示采用了 [mavon-editor](https://github.com/hinesboy/mavonEditor) (PS:真的很好用！！！)

### 后端
  - 使用nodejs环境
  - 采用koaJs做了数据请求的响应处理
  - 采用了mongoDB数据库，使用mongoose做数据库查询

### 服务器
  - 使用nginx代理，静态资源直接本地读取，动态请求转发给本地的koa服务器

### TODO
  还有很多东西要完善… 
  内网修改测试