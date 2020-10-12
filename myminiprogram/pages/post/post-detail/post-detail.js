// pages/post/post-detail/post-detail.js
var postsData = require('../../../data/post-data.js');
var apps = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({postData});
    var postsCollected = wx.getStorageSync('posts_collected');
    if(postsCollected){
      var postCollected = postsCollected[postId];
      if(postCollected){
        this.setData({collected:postCollected})
      }
    }else{ 
      wx.setStorageSync('posts_collected', {})
    }
    if(apps.globalData.g_isPlayingMusic && apps.globalData.g_currentMusicPostId == postId){
      this.setData({
        isPlayingMusic:true
      })
    }
    this.setMusicMonitor();
  },
  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay((res) => {
      that.setData({
        isPlayingMusic:true
      })
      apps.globalData.g_isPlayingMusic = true;
      apps.globalData.g_currentMusicPostId = that.data.currentPostId;
    })
    wx.onBackgroundAudioPause((res) => {
      that.setData({
        isPlayingMusic:false
      })
      apps.globalData.g_isPlayingMusic = false;
      apps.globalData.g_currentMusicPostId = null;
    })
  },
  onCollectionTap:function(){
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.getTip(postsCollected,postCollected)
    //直接弹窗然后消失
    // wx.showToast({
    //   title:postCollected?'收藏成功':'取消收藏成功' ,
    //   duration:1000
    // })
    //询问框，带取消跟确定按钮，可以做选择
  },
  getTip:function(postsCollected,postCollected){
    var that = this;
    wx.showModal({
      title: '收藏',
      content:postCollected?'确认收藏该文章?':'确认取消收藏?',
      success(res){
        if(res.confirm){
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected:postCollected
          })
          wx.showToast({
            title:postCollected?'收藏成功':'取消收藏成功' ,
            duration:1000
          })
        }else if(res.cancel){
          console.log("用户点击了取消按钮")
        }
      }

    })
  },
  onShareTap:function(){
    var itemList = [
      "分享到朋友圈",
      "分享给微信好友",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList:itemList,
      success:function(res){
        wx.showModal({
          title: "用户" + itemList[res.tapIndex] ,
          content:"用户是否取消?"+res.cancel+"现在还无法实现分享功能"
        })
      }
    })
  },
  onMusicTap:function(){
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if(isPlayingMusic){
        wx.pauseBackgroundAudio();
        this.setData({
          isPlayingMusic:false
        })
        apps.globalData.g_isPlayingMusic = false;
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title:postData.music.title,
        coverImgUrl:postData.music.coverImg
      })
      this.setData({
        isPlayingMusic:true
      })
      apps.globalData.g_isPlayingMusic = true;
      // this.data.isPlayingMusic = true
    }
   
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})