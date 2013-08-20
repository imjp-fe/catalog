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
      
    },

    getByCategory: function(categoryName){

    },

    getByDevice: function(device) {

    },

    getRecent: function(limit) {

    },

    getDeviceList: function(){

    },

    getCategoryList: function(){

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
