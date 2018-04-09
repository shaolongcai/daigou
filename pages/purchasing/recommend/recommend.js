// pages/purchasing/recommend/recommend.js
const AV = require("../../../utils/av-webapp-min")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    follow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var query = new AV.Query('post');
    query.descending('createdAt');
    query.find().then(postData=>this.setData({postData}))
  },

  follow:function(event){
    // 获取帖子的主人
    var owner=event.currentTarget.dataset.owner
    const user = AV.User.current()
    console.log(user)
    user.add("follow", owner)
    user.save().then()
    
    // 加入为粉丝
    const user_id = user.id
    var query = new AV.Query('_User');
    query.get(owner).then(owner=>{
      console.log(owner)
      owner.add("fans",user_id)
      owner.save().then()
    })
  }

  
})