// pages/upload/upload.js
const AV = require("../../utils/av-webapp-min.js")
const post = require("../../model/post-model.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text_length:0,
    imgUrls:[],
    isdelete:false,
    delete_model: false,
    // 移动位置
    moveX:[],
    moveY:[],
    img_animation:[],
    zIndex:[],
    count:9,
    place:["香港","日本","澳门","韩国","澳洲","美国","马来西亚"],
    place_choose:"选择代购地点"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = AV.User.current()
    console.log(user)
  },

  onShow:function(){
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 150,
      timingFunction: 'ease',
    })
    this.animation = animation
  },


  // 获取产品简介长度
  bindinput:function(event){
    //获取textarea的输入内容
    var value = event.detail.value
    console.log(value)
    this.setData({
      text_length:value.length,
      value:value
    })
  },

  //上传照片
  upload:function(){
    var count=this.data.count
    wx.chooseImage({
      count:count,
      success: (res=>{
        var img = res.tempFilePaths
        count = count - img.length
        var imgUrls = this.data.imgUrls.concat(img)
        this.setData({
          imgUrls:imgUrls,
          count:count
        })
      })
    })
  },

  // 长按移动图片
  longpress:function(event){
    var img_animation = this.data.img_animation
    //获取点击图片的数组下标
    var img_id = event.target.dataset.id
    // 长按动画
    this.animation.scale(1.2, 1.2).rotate(30).step()
    img_animation[img_id]= this.animation.export()
    this.setData({
      img_animation 
    })
    // 移动时置顶图片
    this.data.zIndex[img_id]=300

    var starX = event.touches[0].clientX
    var starY = event.touches[0].clientY
    this.setData({
      starX: starX,
      starY: starY,
      img_id: img_id,
      ismove:true,
      delete_model:true,
      zIndex:this.data.zIndex
    })
  },

  //移动图片函数
  touchM: function (event){
    var ismove=this.data.ismove
    if(ismove==true){
      // 获取初始坐标
      var starX = this.data.starX
      var starY = this.data.starY
      // 获取变化坐标
      var imgX = event.touches[0].clientX
      var imgY = event.touches[0].clientY
      // 计算移动坐标
      var X = imgX - starX
      var Y = imgY - starY
      console.log("Y坐标为" + imgY)

      // 获取移动图片的数组下标
      var img_id = this.data.img_id
      var moveX = this.data.moveX
      var moveY = this.data.moveY
      moveX[img_id] = X
      moveY[img_id] = Y

      this.setData({
        moveX: moveX,
        moveY: moveY,
        imgY:imgY
      })

      // 若Y坐标大于380，则准备删除
      if (imgY>=550){
        this.setData({
          isdelete:true
        })
      }
      else{
        this.setData({
          isdelete: false
        })
      }
    } 
  },

  // 结束后回到原位
  touchend:function(){
    var img_id = this.data.img_id
    var img_animation = this.data.img_animation
    var imgY = this.data.imgY
    var that=this
    this.setData({
      moveX:[],
      moveY:[],
      delete_model: false,
      //重设不允许直接移动
      ismove: false,
      delete_style: "cancel_del",
      zIndex:[]
    })
    // 还原动画
    this.animation.scale(1, 1).rotate(0).step()
    img_animation[img_id] = this.animation.export()
    this.setData({
      img_animation
    })

    //删除图片
    setTimeout(function(){
      if (imgY > 550) {
        var count = that.data.count
        count = count + 1
        // 删除图片
        that.data.imgUrls.splice(img_id, 1)
        that.setData({
          imgUrls: that.data.imgUrls,
          isdelete:false,
          imgY:0,
          count:count
        })
      }
    }, 10)
  },

    //选择代购地点
  place_choose:function(event){
    var index = event.detail.value
    var place_choose = this.data.place[index]
    console.log(place_choose)
    this.setData({
      place_choose
    })
  },

  // 预览图片
  previewImage:function(){
    console.log("1")
    current: '/images/Amazon.jpg'
    complete:(res=>console.log(res))
  },  

  //发布
  release: function () {
    const user = AV.User.current()
    var user_id=user.id
    // 关联发布者的user_id
    var user_id = AV.Object.createWithoutData('_User', user_id)
    var imgUrls = this.data.imgUrls
    var place = this.data.place_choose
    if (imgUrls == "" || place == "选择代购地点") {
      wx.showToast({
        title: "请填写完整信息",
        image: "/images/icon/warn.png",
        mask: true,
        duration: 1000
      })
    }
    else {
      wx.showLoading({
        title: '正在上传中',
        mask: true
      })
      imgUrls.map(imgUrl => () => new AV.File('filename', {
        blob: {
          uri: imgUrl,
        },
      }).save()).reduce(
        (m, p) => m.then(v => AV.Promise.all([...v, p()])),
        AV.Promise.resolve([])
        //Arr.map()方法为每个数组中的元素都调用一次callback并返回结果。Arr.map(obj,callback),then()一定会最后执行
        ).then(
        //新增数据表
        files =>
          new post({
            place: place,
            imgUrl: files.map(file => file.url()),
            content:this.data.value,
            owner:user_id
          }).save()
            //保存完后再跳转，then()只能链式调用
            .then(res => {
              // 关联发布者发布的post_id
              var post_id = res.id
              user.add("post_list",post_id)
              user.save().then()
              wx.showToast({
                title: '上传成功',
                mask: true,
                duration: 1000
              })
            }).then(
            wx.switchTab({
              url: '/pages/purchasing/recommend/recommend',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) {
                res => console.log(res)
              },
            })
            )
        )
        .catch(console.error);
    }
  }

})