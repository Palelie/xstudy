/**
 * 自动生成侧边栏文件
 * 技术：node文件模块的相关pai函数的使用
 * 使用：在config.js中引用该文件，然后配置项 sidebar: createSideBar()
 */
 const fs = require('fs') // 文件模块
 const file_catalogue = {} // 最终返回的路由
  
 module.exports = {
     /**
      * 自动生成侧边栏
      * @param {String} path 路径，特指存放文章的根目录
      * @param {Array} white_path 路由白名单 表示不参与构建路由的文件名称
      */
     createSideBar(path = '', white_path = []) {
         this.getFileCatalogue('/' + path, white_path)
  
         return this.reverse(file_catalogue)
     },
  
     /**
      * 查询某一文件夹目录下的所有文件
      * @param {string} path 文件根目录
      * @param {Array} white_path 路由白名单 表示不参与构建路由的文件名称
      */
     getFileCatalogue(path= '', white_path = []) {
         // 1. 过滤掉白名单的文件
         const catagolue_list = fs.readdirSync('./' + path).filter(file => !white_path.includes(file))
         if (!catagolue_list.length) {
             return
         }
  
         // 2.找到的文件包含.md字符，判定为单一文件
         file_catalogue[path + '/'] = [
             {
                 title: path.split('/')[path.split('/').length - 1],
                 children: catagolue_list.filter(v => v.includes('.md')).map(file => { return file === 'README.md' || white_path.includes(file) ? '' : file.substring(0, file.length - 3) })
             }
         ]
  
         // 3.找到的文件存在不包含.md文件，即存在文件夹，继续查找
         catagolue_list
             .filter(v => !v.includes('.md'))
             .forEach(new_path => this.getFileCatalogue(path + '/' + new_path, white_path))
     },
  
     /**
      * 反序
      * 原因：查找侧边栏是从上到下匹配，但是生成的配置是从外到内，即更详细的目录结构其实是放在最下边，所以要反序
      */
     reverse(info) {
         let new_info = {}
         const info_keys = Object.keys(info).reverse()
  
         info_keys.forEach(key => {
             new_info[key] = info[key]
         })
         return new_info
     }
 }
 