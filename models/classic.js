import { HTTP } from '../util/http.js'
class ClassicModel extends HTTP {
  getLatest(sCallback) {
    this.request({
      url: 'classic/latest',
      success: (res) => {
        sCallback(res)
        // 获取最新一期期刊现存入到缓存当中
        this._setLatestIndex(res.index)
        let key = this._getKey(res.index)
        wx.setStorageSync(key, res)
      }
    })
  }

  /**
   * 获取流行界面期刊，上一期或者下一期
   * 在发送请求之前先检查缓存中是否存下信息
   * 有的话直接从缓存中取，没有的话再去请求
   */
  getClassic(index, nextOrPrevious, sCallback) {
    let key = nextOrPrevious == 'next' ? this._getKey(index + 1) : this._getKey(index - 1)
    let classic = wx.getStorageSync(key)
    if (!classic) {
      this.request({
        url: `classic/${index}/${nextOrPrevious}`,
        success: (res) => {
          wx.setStorageSync(this._getKey(res.index), res)
          sCallback(res)
        }
      })
    } else {
      sCallback(classic)
    }
  }

  /**
   * 是否是第一期，最早的一期期刊
   */
  isFirst(index) {
    return index == 1 ? true : false
  }

  /**
   * 是否是最后一期，最新一期期刊
   * 最开始请求的是最新一期期刊号并且存入缓存
   * 将当前期刊号与缓存中的最新期刊号进行比对即可
   */
  isLatest(index) {
    let latestIndex = this._getLatestIndex()
    return latestIndex == index ? true : false
  }

  /**
   * 获取最新一期的期刊号
   * 从缓存中获取最新一期期刊号
   */
  _getLatestIndex() {
    const index = wx.getStorageSync('latest')
    return index
  }

  /**
   * 向缓存中存入最新一期期刊号
   * 并且将其写入到缓存中
   */
  _setLatestIndex(index) {
    wx.setStorageSync('latest', index)
  }

  /**
   * 封装index作为缓存中的key
   */
  _getKey(index) {
    const key = 'classic-' + index
    return key
  }

}

export {ClassicModel}