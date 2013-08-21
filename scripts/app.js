;(function (window, document, $, Backbone, _, undefined) {

  // some code ..
  console.log("test");


  var Model = Backbone.Model.extend({
    initialize: function(){

    },
  });

  var Collection = Backbone.Collection.extend({
    initialize: function(){

    },

    getByWord: function(word){

      /* DUMMY jsonデータ */
      return [
        {
          "URL":"http://hogehoge.com",
          "title":"wordによる絞り込み１",
          "summary":"さっぱり生麺タイプ サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif"
        },
        {
          "URL":"http://hogehoge.com",
          "title":"wordによる絞り込み２",
          "summary":"こってり生麺タイプ サマリーが入ります。サマリーが入ります。サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif"
        }
      ];
    },

    getByCategory: function(categoryName){
      /* DUMMY jsonデータ */
      return [
        {
          "URL":"http://hogehoge.com",
          "title":"カテゴリーによる絞り込み１",
          "summary":"さっぱり生麺タイプ サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif"
        },
        {
          "URL":"http://hogehoge.com",
          "title":"カテゴリーによる絞り込み２",
          "summary":"こってり生麺タイプ サマリーが入ります。サマリーが入ります。サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif"
        }
      ];
    },

    getByDevice: function(device) {
      /* DUMMY jsonデータ */
      return [
        {
          "URL":"http://hogehoge.com",
          "title":"デバイスによる絞り込み１",
          "summary":"さっぱり生麺タイプ サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif"
        },
        {
          "URL":"http://hogehoge.com",
          "title":"デバイスによる絞り込み２",
          "summary":"こってり生麺タイプ サマリーが入ります。サマリーが入ります。サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif"
        }
      ];
    },

    getRecent: function(limit) {
      /* DUMMY jsonデータ */
      return [
        {
          "URL":"http://hogehoge.com",
          "title":"塩ラーメン",
          "summary":"さっぱり生麺タイプ サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif",
          "creator":"Hoge",
          "email":"hoge@hoge.com",
          "version":"0.1",
          "create date":"2002-09-24+09:00",
          "update date":"2002-10-24+09:00",
          "license":"",
          "tags":["hoge","poop"],
          "device":["PC", "iPhone"],
          "Browser":["Chrome", "Firefox"],
          "man-hour":34
        },
        {
          "URL":"http://hogehoge.com",
          "title":"みそラーメン",
          "summary":"こってり生麺タイプ サマリーが入ります。サマリーが入ります。サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif",
          "creator":"Hoge",
          "email":"hoge@hoge.com",
          "version":"0.1",
          "create date":"2002-09-24+09:00",
          "update date":"2002-10-24+09:00",
          "license":"",
          "tags":["hoge","poop"],
          "device":["PC", "iPhone"],
          "Browser":["Chrome", "Firefox"],
          "man-hour":34
        },
        {
          "URL":"http://hogehoge.com",
          "title":"豚骨ラーメン",
          "summary":"こってり生麺タイプ サマリーが入ります。サマリーが入ります。サマリーが入ります。サマリーが入ります。",
          "thumb":"/images/img_thumb.gif",
          "creator":"Hoge",
          "email":"hoge@hoge.com",
          "version":"0.1",
          "create date":"2002-09-24+09:00",
          "update date":"2002-10-24+09:00",
          "license":"",
          "tags":["hoge","poop"],
          "device":["PC", "iPhone"],
          "Browser":["Chrome", "Firefox"],
          "man-hour":34
        }
      ];
    },

    getDeviceList: function(){
      /* DUMMY jsonデータ */
      return ['PC', 'Smartphone', 'tablet'];
    },

    getCategoryList: function(){
      /* DUMMY jsonデータ */
      return ['ajax', 'animation', 'API', 'js'];
    }
  });

  var IndexPageView = Backbone.View.extend({
    events: {

    },

    initialize: function(){

    },

  });

  var ListPageView = Backbone.View.extend({
    events: {

    },

    initialize: function(){

    }

  });

  var SearchView = Backbone.View.extend({
    events: {

    },

    initialize: function(){

    }

  });

  var CategoryListView = Backbone.View.extend({
    events: {

    },
    initialize: function(){
      this.renderTags();
      this.renderDevice();
    },
    renderTags: function(){
      var tags = collection.getCategoryList();
      var ul = $('#tags ul');
      this.render(tags, ul);
    },
    renderDevice: function(){
      var devices = collection.getDeviceList();
      var ul = $('#devices ul');
      this.render(devices, ul);
    },
    render: function(items, ul){
      var $templateString = $('#categoryTemplate').html();
      var list = _.template($templateString, {obj:items});
      ul.append(list);
    }
  });


  var ResultView = Backbone.View.extend({
    events: {

    },
    initialize: function(){
      this.renderRecent();
      this.renderWord();
      this.renderCategory();
      this.renderDevice();
    },
    renderRecent: function(){
      var itemRecent = collection.getRecent();
      var ul = $('#recentList ul');
      this.render(itemRecent, ul);
    },
    renderWord: function(){
      var itemWord = collection.getByWord();
      var ul = $('#wordList ul');
      this.render(itemWord, ul);
    },
    renderCategory: function(){
      var itemCategory = collection.getByCategory();
      var ul = $('#categoryList ul');
      this.render(itemCategory, ul);
    },
    renderDevice: function(){
      var itemDevice = collection.getByDevice();
      var ul = $('#deviceList ul');
      this.render(itemDevice, ul);
    },
    render: function(items, ul){
      var $templateString = $('#resultTemplate').html();
      var list = _.template($templateString, {obj:items});
      ul.append(list);
    }
  });

  var Router = Backbone.Router.extend({
    routes: {
      "/": "index",
      "/list": "list",
      "/list/device_:device": "device",
    },

    index: function(){},

    list: function(){},

    device: function(device){}

  });


  var collection = new Collection();
  var categoryListView = new CategoryListView();
  var resultView = new ResultView();


})(window, document, jQuery, Backbone, _);
