// pages/purchasing/recommend/recommend.js
const AV = require("../../utils/av-webapp-min")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    follow:true,
    purchasing:true,
    attention_color:"#333",
    recommend_color:"#4aa8fe",
    postData_follow:[]
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
    const user = AV.User.current()
    query.descending('createdAt');
    query.find().then(postData=>{
      for(var i=0;i<postData.length;i++){
        var follow = user.attributes.follow
        var owner = postData[i].attributes.owner.id
        var value=follow.indexOf(owner)
        if(value!=-1){
          postData[i].attributes.follow = true
        }
        else{
          postData[i].attributes.follow = false
        }
      }
      this.setData({ postData })
    })
  },

  follow:function(event){
    console.log(event)
    // 获取帖子的主人
    var owner=event.currentTarget.dataset.owner
    const user = AV.User.current()
    user.add("follow", owner)
    user.save().then()

    var postData = this.data.postData
    for (var i = 0; i < postData.length; i++) {
      //每篇帖子的主人
      var owner_id = postData[i].attributes.owner.id
      var follow = postData[i].attributes.follow
      // 凡是帖子的主人都等于被关注人的id 则都将follow设为true
      if (follow == false && owner_id==owner) {
        postData[i].attributes.follow = true
      }
      else {}
      this.setData({postData})
    }
    
    
    // 加入为粉丝 206报错 不能改变其他用户的状态，需要通过后台来操作
    // const user_id = user.id
    // var query = new AV.Query('_User');
    // query.get(owner).then(owner=>{
    //   console.log(owner)
    //   owner.add("fans",user_id)
    //   owner.save().then()
    // })
  },

  // 切换到推荐面板
  recommend:function(){
    this.setData({
      purchasing: true,
      attention_color: "#333",
      recommend_color: "#4aa8fe"
    })
    
  },
  
  //切换到关注面板
  attention:function(){
    this.setData({
      purchasing:false,
      attention_color:"#4aa8fe",
      recommend_color:"#333"
    })
    var postData_follow = this.data.postData_follow
    const user = AV.User.current()
    // 获取关注列表
    var follow = user.attributes.follow
    var query = new AV.Query('_User');
    var query_post = new AV.Query("post")
    for(var index in follow){
      var follow_id = follow[index]
      console.log(follow_id)
      // 此处查询是异步，先发送查询请求，同时获取follow_id 所以会先console出所有follow_id
      query.get(follow_id).then(
        res=>{
          // 获取关注人所发的帖子
          var post_list = res.attributes.post_list
          for(var i in post_list){
            var post_id=post_list[i]
            query_post.get(post_id).then(post=>{
              postData_follow.push(post)
              console.log(postData_follow)
              this.setData({ postData_follow })
            })
            
          }
        }
      )
    }
  }
})