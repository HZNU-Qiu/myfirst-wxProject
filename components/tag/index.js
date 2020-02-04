// components/tag/index.js
Component({

  /**
   * 启用组件插槽，一个组件可以有多个插槽
   */
  options: {
    multipleSlots: true
  },
  externalClasses:['tag-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    text: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(event) {
      this.triggerEvent('tapping', {
        text: this.properties.text
      })
    }
  }
})
