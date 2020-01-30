// components/navi/navi.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    // 当前期刊是否是第一期(最早的一期)
    first: Boolean,
    // 当前期刊是否是最新期(最后一期)
    latest: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    disLeftSrc: '../images/triangle.dis@left.png',
    leftSrc: '../images/triangle@left.png',
    disRightSrc: '../images/triangle.dis@right.png',
    rightSrc: '../images/triangle@right.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLeft: function(event) {
      if (!this.properties.latest) {
        this.triggerEvent('left', {}, {})
      }
    },

    onRight: function(event) {
      if (!this.properties.first) {
        this.triggerEvent('right', {}, {})
      }
    }
  }
})