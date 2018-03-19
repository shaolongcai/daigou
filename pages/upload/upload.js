// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text_length:0,
    imgUrls:[],
    // 移动初始化数据
    moveX:[],
    moveY:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


  // 获取产品简介长度
  bindinput:function(event){
    //获取textarea的输入内容
    var value = event.detail.value
    var text_length=value.length
    this.setData({
      text_length
    })
  },

  //上传照片
  upload:function(){
    wx.chooseImage({
      count:9,
      success: (res=>{
        var img= res.tempFilePaths
        var imgUrls = this.data.imgUrls.concat(img)
        this.setData({
          imgUrls
        })
      })
    })
  },

  longpress:function(event){
    console.log("555555")
  },

  //开始移动图片
  touchS:function(event){
    console.log(event)
    var starX = event.touches[0].clientX
    var starY = event.touches[0].clientY
    var img_id = event.target.dataset.id
    console.log(img_id)
    this.setData({
      starX:starX,
      starY:starY,
      img_id: img_id
    })
  },

  //移动图片函数
  touchM: function (event){
    // 获取初始坐标
    var starX = this.data.starX
    var starY = this.data.starY
    // 获取变化坐标
    var imgX = event.touches[0].clientX
    var imgY = event.touches[0].clientY
    // 计算移动坐标
    var X=imgX-starX
    var Y=imgY-starY
    
    // 获取移动图片的数组下标
    var img_id = this.data.img_id
    var moveX = this.data.moveX
    var moveY = this.data.moveY
    moveX[img_id]= X
    moveY[img_id]=Y
   
    this.setData({
      moveX:moveX,
      moveY:moveY
    })
  },

  // 结束后回到原位
  touchend:function(){
    this.setData({
      moveX:[],
      moveY:[]
    })
  }


//   //添加数据到lendcloud上
//  bindsubmit: function (event) {
//     var goods_name = event.detail.value.goods_name
//     var goods_price = event.detail.value.goods_price
//     var goods_cost = event.detail.value.goods_cost
//     var goods_brief = event.detail.value.goods_brief

//     if (goods_name == "" || goods_price == "" || this.data.imgUrl[0] == "/image/icon/chose_img2.png") {
//       wx.showToast({
//         title: "请输入完整信息",
//         image: "/image/icon/warn.png",
//         mask: true,
//         duration: 2000
//       })
//     }
//     else {
//       wx.showLoading({
//         title: '正在上传中',
//         mask: true
//       })
//       this.data.imgUrl.map(imgUrl => () => new AV.File('filename', {
//         blob: {
//           uri: imgUrl,
//         },
//       }).save()).reduce(
//         (m, p) => m.then(v => AV.Promise.all([...v, p()])),
//         AV.Promise.resolve([])
//         //Arr.map()方法为每个数组中的元素都调用一次callback并返回结果。Arr.map(obj,callback),then()一定会最后执行
//         ).then(
//         //新增数据表
//         files =>
//           new goods({
//             goods_name: goods_name,
//             imgUrl: files.map(file => file.url()),
//             price: goods_price,
//             cost: goods_cost,
//             brief: goods_brief
//           }).save()
//             //保存完后再跳转，then()只能链式调用
//             .then(res => {
//               var choose_id = this.data.choose_id
//               if (choose_id == "goods") {
//                 wx.reLaunch({
//                   url: '/record/record_upload/record_upload',
//                 })
//               }
//               else {
//                 wx.reLaunch({
//                   url: '/pages/home',
//                 })
//               }
//             })
//         )
//         .catch(console.error);
//     }
//   },
})