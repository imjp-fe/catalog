;(function (window, document, $, Backbone, _, undefined) {

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
      var objects = [];
      _.each(this.models, function (el, i) {
        var object = el.toJSON(),
            prop = object.device;
        if (_.isArray(prop)) {              // if prop is "Array"
          _.each(prop, function (val, j) {
            if (prop === device) {
              objects.push(object);
            }
          });
        } else {                            // if prop is "string"
          if (prop === device) {
            objects.push(object);
          }
        }
      });
      return objects;
    },

    getRecent: function(limit) {
      var objects = [];
      for (var i = 0; i < limit; i++) {
        objects[i] = this.models[i].toJSON();
      };
      return objects;
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
    // console.log(collection.getByWord());
    // console.log(collection.getByCategory());


    console.log(collection.getByDevice('sp'));
    // console.log(collection.getRecent(4));
    
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
