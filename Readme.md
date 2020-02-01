# 学习笔记

## 项目结构
- 根目录下app.* 全局文件
- config.js 配置文件，可以把一些全局固定的常量写在其中，如http请求基地址，随机字符串等
- pages 页面文件夹，顾名思义，用于承载显示页面的文件

```
|--pages
|---|--classic //每个页面都有自己的文件夹
|---|----|---classic.js // classic页面的js文件，可以在其中自定义监听
|---|----|---classic.json // classic页面的json文件，可以在其中引用页面所需要的组件
|---|----|---classic.wxml // 页面源文件，相当于web中html
|---|----|---classic.wxss // 页面样式文件，相当于web中的css
|---|--movie
```

- components 组件文件夹，用于承载用于构成页面的组件，组件中的js代码一般只用于组建自己的响应式，一般不在其中写数据交互的方法。
```
|--components
|---|--like //每个组件都有自己的文件夹
|---|----|---index.js // like组件的js文件，可以在其中自定义监听
|---|----|---index.json // like页面的json文件，可以在其中引用页面所需要的组件
|---|----|---index.wxml // 组件源文件，相当于web中html
|---|----|---index.wxss // 组件样式文件，相当于web中的css
|---|--images // 组件需要的图片文件夹，放在组件目录下的优势是所有图片是公用的每个组件都可以调用。也可以放在每个文件夹当中，作为每个组件自己的图片
```
- models 模型文件夹，用于写每个组件用于数据交互的方法，一般保证组件的可复用性，不把用于前后交互的方法写在组件当中。另起一个model来写交互请求的方法，在页面js中调用即可
- utils 工具文件夹，里面写一些工具方法，比如对http请求的二次封装等

## Pages 视图层
用于页面显示的文件都可以放在页面当中，每个页面都是一个文件夹，里面有js、json、wxss、wxml文件
详情参考[开发者文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)

## 收获的经验
- 在做前端开发的时候，视图层的文件结构，写成一个一个的文件夹，每个文件夹当中有属于当前页面自己的js、json、wxml、wxss等文件。这样显得结构更加的清晰并且可维护性较好
- 一个页面是由多个组件构成的，可以说就如同搭积木一样，所有的页面是由一个个组件拼装组成的。一个页面当中真正属于自己的代码应该是比较少的。因为考虑到复用性，很多页面应该都有很多共性，这些共性我们就可以把它写成组件的新式，用到的时候我们就引入它，这样可以减少开发代码的冗余，可维护性也十分的棒，毕竟只需要更改组件的代码就可以了。
- HTTP的二次封装，我们在发送HTTP请求的时候都会在js当中写http.request的方法，这里微信使用wx.request()的方法发送http请求，但是，这样总觉得有点麻烦，每次放松一个请求的就得写好几行代码，变化的就是请求方法的参数，其他的格式都没有变化。所以为了简化代码我们可以对http请求进行二次封装，详情参考 /utils/http.js 中的代码

## 编写组建代码的一些细节
### 私有性/开放性
在组件的 .js文件当中 
- **properties**组件的属性列表，开放出来的数据，也就是说是可以被外部操作的数据。
### observer属性
当属性值发生变化时触发，但是一定要注意**内存泄漏**问题，就比如在数字前面实现前导零的需求，按道理来说字符串前加0就完事了，但是如果使用observe来实现就会出现无限调用的情况发生，因为字符串加了个0还是发生了变化作为数字处理还是满足出发条件。

数据format可以尝试以下两种方法，使用observe对data数据进行操作即可，或者使用**wxs**(推荐使用)

- **data**组件的初始数据，私有的数据，自己内定好的数据

**也就是说，对于一个组件，我们要考虑好那些数据该开放，那些数据是内定数据。一般由服务端返回的数据可以写在properties中，组件需要用到哪些图片的路径信息可以私有化，写在data中**
- **method**组件的方法

### setData方法
用于创建/更新 **data**里的数据的方法，data里没有的变量，使用setData方法即为创建并且赋值，如果data中有此变量即为更新数据。
以下这张图讲述了Page与组件的关系以及数据传递的模式路线
![wx数据绑定关系图.jpg](https://i.loli.net/2020/01/18/slck7h9Dpbvo4dM.png)


### 自定义触发器以及自定义监听和激活
在组件的method方法中可以使用this.triggerEvent(),使用监听事件可以使得使用组件的页面可以监听组件发生的事件并且获得相关的参数。用于与组件的通信。

## 纯粹的回调函数/promise/async await

- 纯粹的callback => 回调地狱 return
- promise  支持多个异步等待合并 不需要层层传递callback
- async await ES7 小程序 不支持

```
const promise = new Promise((resolve, reject) => {
      // pending fulfilled rejected
      // 进行中    已成功    已失败   凝固不可再变化了
      //     resolve    reject
      wx.getSystemInfo({
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })

    promise.then((res) => {
      console.log(res)
    }, (error) => {
      console.log(error)
    })
```

### 场景 依次调用三个API
```
// promise 的错误用法，与回调地狱无区别
const hotList = bookModel.getHotList()
    hotList.then(
      res => {
        console.log(res)
        bookModel.getMyBookCount()
          .then(res => {
            console.log(res)
          })
      }
    )

// 正确写法
bookModel.getHotList()
    .then(res => {
      console.log(res)
      return bookModel.getMyBookCount()
    })
    .then(res => {
      console.log(res)
      return bookModel.getMyBookCount()
    })
    .then(res => {
      console.log(res)
    })
```

## 实现页面跳转
```
wx.navigateTo({
  url: ''
})
```
### 在组件里实行页面跳转
- 降低了组件的通用性
- 但是很方便
- 仅仅是服务于当前项目的项目组件，用到别的项目中就别再组件中写跳转逻辑了
- **通用的方法的话可以在组建中实现自定义触发器，在页面中进行监听**

## 组件插槽 <slot>
- 应用场景：比如tag标签，有数据就显示没数据就不显示。
使用插槽，在组件中预留可空字段的插槽
- 插槽：可以从外部传入一个标签，一个组件可以有多个插槽

组件使用插槽需要在组建index.js中启用插槽
```
 options: {
    multipleSlots: true
  },
```
在页面中使用组件，并且使用插槽。组件就必须写成**闭合标签**而不是单行标签，而且在待添加标签中添加‘slot’属性name对应组件中的name
```
// 组件wxml
<view class="container">
    <text>{{text}}</text>
    <!-- slot插槽 可以通过外部传一个标签 -->
    <slot name="after"></slot>
</view>

// 页面wxml
<v-tag text="{{item.content}}">
  <text slot="after">{{'+item.nums}}</text>
</v-tag>
```