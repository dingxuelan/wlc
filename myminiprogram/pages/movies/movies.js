// pages/movies/movies.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"+"?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"+"?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250"+"?start=0&count=3";
    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","top250");
  },
  getMovieListData:function (url,type,title) {
    var that = this;
    wx.request({
      url: url,
      method:'GET',
      success:function(res){
        that.processDoubanData(res.data,type,title)
      }
    })
  },
  processDoubanData:function(data,keys,movieTitle){
    var movies = [];
    for(var key in data.subjects){
      var subject = data.subjects[key];
      var title = subject.title;
      if(title.length >= 6 ){
        title = title.substring(0,6) + "..."
      }
      var temp = {
        stars:util.converToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[keys] = {
      movieTitle:movieTitle,
      movies:movies
    };
    this.setData(readyData)
    console.log(readyData)
  },
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category
    })
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