// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: "",
    movies:[],
    requestUrl:"",
    totalCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.setData({ navigateTitle: category })
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.setData({
      requestUrl:dataUrl
    })
    util.getMovie(dataUrl,this.processDoubanData)
  },
  processDoubanData:function(data){
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
    var totalMovie = this.data.movies.concat(movies);
    console.log("我是  "+totalMovie);
    this.setData({
      movies:totalMovie
    })
    this.data.totalCount+=20;
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
   
   
  },
  onReachBottom:function(evnet){
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.getMovie(nextUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh:function(event){
    var refeshUrl = this.data.requestUrl + "?start=0&count=20";
   this.data.movies = [];
    util.getMovie(refeshUrl,this.processDoubanData);
    wx.showNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
  


})