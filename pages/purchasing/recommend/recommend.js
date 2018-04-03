// pages/purchasing/recommend/recommend.js
const AV = require("../../../utils/av-webapp-min")

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

  
})