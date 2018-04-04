//app.js
const AV = require("utils/av-webapp-min.js")

//初始化AV参数
AV.init({
  appId: 'FQcMNvzAQzhGrzLddOXhqk9P-gzGzoHsz',
  appKey: 'ogqVeGxCjnegHYBzS3RvS95E',
})

App({
  onLaunch: function () {
    AV.User.loginWithWeapp().then(user => {
      wx.setStorage({
        key: 'user',
        data: user.toJSON(),
      })

    }).catch(console.error);

    //登录
    wx.login({
      success: function (res) {
        //获取leancloud的用户
        const user = AV.User.current();
        //成功后获取code，将code发送到微信的api解码，获取openid
        wx.request({
          url: "https://api.weixin.qq.com/sns/jscode2session?appid=wxc869760f75f47ff0&secret=a37c1061f9b7d2e2b5391b495f655a09&js_code=" + res.code + "&      grant_type=authorization_code",
          data: {
            code: res.code
          },
          success: res => {
            //同步openid到leancloud后台
            user.set(res).save().then(user => console.log(user))
          }
        })
      },
    })

    // 这个放进点击上传按键时请求 或点击关注时，或切换到聊天以及我的再请求
    wx.getUserInfo({
      success:(res=>{
        const user = AV.User.current();
        var userInfo=res.userInfo
        user.set(userInfo).save().then() 
      })
    })

    
  },

})