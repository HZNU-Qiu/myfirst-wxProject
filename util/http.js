import { config } from '../config.js'

const tips = {
  1: 'Sorry~',
  1005: 'appkey无效',
  3000: '期刊不存在'
}

// 对HTTP请求进行二次封装
class HTTP {
  request(params) {
    // 设置请求默认方法为GET
    if (!params.method) {
      params.method = 'GET'
    }
    /**
     * url 请求url
     * data 请求数据
     * method 请求方法
     */
    wx.request({
      url: config.api_base_url + params.url,
      method: params.method,
      data: params.data,
      header: {
        'content-type': 'application/json',
        'appkey': config.appkey
      },
      // 响应成功回调方法，无论是2XX还是4XX、5XX都算做success
      success: (res) => {
        let code = res.statusCode.toString()
        // 使用ES6的方法，如果code以2开头就算请求成功
        if (code.startsWith('2')) {
          params.success && params.success(res.data)
        } else {
          // 都算作失败请求处理
          let error_code = res.data.error_code
          this._show_error(error_code)
        }
      },
      // 这个就属于响应失败的回调方法了
      fail: (err) => {
        this._show_error(1)
      }
    })
  }
  // 在方法名称前面加下划线代表其是一个私有方法，约定而已
  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    wx.showToast({
      title: tips[error_code],
      icon: 'none',
      duration: 2000
    })
  }

}

export {
  HTTP
}