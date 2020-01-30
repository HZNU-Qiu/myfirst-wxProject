import { ClassicModel } from '../../models/classic.js'
import { LikeModel } from '../../models/like.js'
let classicModel = new ClassicModel()
let likeModel = new LikeModel()
// pages/classic/classic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classic: null,
    latest: true,
    first: false,
    likeCount: 0,
    likeStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    classicModel.getLatest((res) => {
      // Page JS 通过setData将数据与Page WXML绑定
      // setData(传入一个js对象),绑定后wxml 又可以通过组件属性传入到组件内部
      // 注意！！！ setData的作用是data的定义/更新，其实不用setdata，wxml也可以获取到data对象里的参数
      this.setData({
        classic: res,
        likeCount: res.fav_nums,
        likeStatus: res.like_status
      })
    })
  },

  // 自定义监听事件
  onLike: function(event) {
    let behavior = event.detail.behavior
    likeModel.like(behavior, this.data.classic.id, this.data.classic.type)
  },

  onNext: function(event) {
    this._updateClassic('next')
  },

  onPrevious: function(event) {
    this._updateClassic('previous')
  },

  _updateClassic: function (nextOrPrevious) {
    const index = this.data.classic.index
    classicModel.getClassic(index, nextOrPrevious, (res) => {
      // 这里需要获取是否喜欢的状态
      this._getLikeStatus(res.id, res.type)
      this.setData({
        classic: res,
        latest: classicModel.isLatest(res.index),
        first: classicModel.isFirst(res.index)
      })
    })
  },

  _getLikeStatus(artID, category) {
    likeModel.getClassicLikeStatus(artID, category,
      (res) => {
        this.setData({
          likeCount: res.fav_nums,
          likeStatus: res.likeStatus
        })        
      }
    )
  }

})