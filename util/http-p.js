import { config } from '../config.js'

const tips = {
  1: 'Sorry~',
  1005: 'appkey无效',
  3000: '期刊不存在'
}

// 对HTTP请求进行二次封装
class HTTP {
  // 对象的解构应用
  request({ url, data = {}, method = 'GET' }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }

  _request(url, resolve, reject, data = {}, method = 'GET') {
    /**
     * url 请求url
     * data 请求数据
     * method 请求方法
     */
    wx.request({
      url: config.api_base_url + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'appkey': config.appkey
      },
      // 响应成功回调方法，无论是2XX还是4XX、5XX都算做success
      success: (res) => {
        const code = res.statusCode.toString()
        // 使用ES6的方法，如果code以2开头就算请求成功
        if (code.startsWith('2')) {
          resolve(res.data)
        } else {
          // 都算作失败请求处理
          reject()
          const error_code = res.data.error_code
          this._show_error(error_code)
        }
      },
      // 这个就属于响应失败的回调方法了
      fail: (err) => {
        reject()
        this._show_error(1)
      }
    })
  }
  // 在方法名称前面加下划线代表其是一个私有方法，约定而已
  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    const tip = tips[error_code]
    wx.showToast({
      title: tip ? tip : tips[1],
      icon: 'none',
      duration: 2000
    })
  }

}

export {
  HTTP
}