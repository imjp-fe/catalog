;(function (window, document, $, Backbone, _, undefined) {

  // some code ..

  var Model = Backbone.Model.extend({

    initialize: function(){
    }

  });


  var Collection = Backbone.Collection.extend({

    model: Model,

    url: '/data.json',

    initialize: function(){
      //console.log(this.models);
    },

    getByWord: function(word){

      var res = '';

      
      var list = this.where({"man-hour": 160}),
          _list = [];

      list.forEach(function (el, i) {
        _list[i] = el.toJSON();
      });
      
      console.log(_.pluck(_list, 'man-hour'));
      
      return res;
      
    },

    getByCategory: function(categoryName){

      var res = '';

      console.log(this.models);

      return res;

    },

    getByDevice: function(device) {

      var res = '';

      console.log(this.models);

      return res;

    },

    getRecent: function(limit) {

      var res = '';

      console.log(this.models);

      return res;

    },

    getDeviceList: function(){

      var res = '';

      console.log(this.models);

      return res;

    },

    getCategoryList: function(){

      var res = '';

      console.log(this.models);

      return res;

    }

  });

  var collection = new Collection();


  collection.fetch().done(function (res) {
    //console.log(res);
    //console.log(collection.models);
    console.log(collection.getByWord());
    
    // console.log(collection.getByCategory());
    // console.log(collection.getByDevice());
    // console.log(collection.getRecent());
    // console.log(collection.getDeviceList());
    // console.log(collection.getCategoryList());
  });

















  /*!
   * VIEW
   */
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
    
    }
  
  });

  var ResultView = Backbone.View.extend({
    events: {
    
    },

    initialize: function(){
    
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


})(window, document, jQuery, Backbone, _);
