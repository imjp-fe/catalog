;(function (window, document, $, Backbone, _, undefined) {

  var Model = Backbone.Model.extend({

    initialize: function(){
    }

  });


  var Collection = Backbone.Collection.extend({

    model: Model,

    url: '/data.json',

    getByWord: function(word){
      var objects = [],
          words = [],
          scope = ['summary', 'title', 'creator', 'tags', 'device', 'browser'],
          noIncludeWords = ['summary'],
          caches = [],
          word = word.toLowerCase().replace(/^(?:\s*)?(\S+?)(?:\s*)?$/, '$1'),
          reg = new RegExp('\\s*?' + word + '\\s*?');

      var isDuplicate = function(str){
        for(var i = 0, l = words.length; i < l; i++){
          if(str.toLowerCase() == words[i].toLowerCase()){
            return true;
          }
        }
        return false;
      };

      var isIncludeWords = function(str) {
        for(var i = 0, l = noIncludeWords.length; i < l; i++){
          if(str.toLowerCase() == noIncludeWords[i].toLowerCase()){
            return false;
          }
        }
        return true;
      }

      var add = function(key, word, model) {
        if (reg.test(word.toLowerCase())) {          
          if (!isDuplicate(word) && isIncludeWords(key)) words.push(word);
          objects.push(model.toJSON());
        }
      }

      for (var i = 0, l = this.models.length; i < l; i++) {
        var pick = this.models[i].pick(scope);
        for (key in pick) {
          if (_.isArray(pick[key])) {
            for (var j = 0, k = pick[key].length; j < k; j++) {
              add(key, pick[key][j], this.models[i]);
            }
            continue;
          }
          if (_.isString(pick[key])) {
            add(key, pick[key], this.models[i]);
            continue;
          }
        }
      };
      
      return { objects: objects, words: words };
    },

    getByCategory: function(categoryName){

      var res = '';

      console.log(this.models);

      return res;

      // var res = '';

      // var list = this.where({"man-hour": 160}),
      //     _list = [];

      // list.forEach(function (el, i) {
      //   _list[i] = el.toJSON();
      // });
      
      // console.log(_.pluck(_list, 'man-hour'));
      
      // return res;

    },

    getByDevice: function(device) {
      var objects = [];
      _.each(this.models, function (el, i) {
        var object = el.toJSON(),
            prop = object.device;
        if (_.isArray(prop)) {              // if prop is "Array"
          _.each(prop, function (val, j) {
            if (val === device) {
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
      var objects = [],
          sotred = _(this.models).sortBy(function (object) {
            return Date.parse(object.toJSON().create_date);
          });
      sotred = sotred.slice(0, limit);
      _.each(sotred, function (el, i) {
        objects[i] = el.toJSON();
      });
      return objects;
    },

    getDeviceList: function(){
      var objects = [];
      _.each(this.models, function (el, i) {
        objects[i] = el.toJSON().device;
      });
      objects = _.uniq(objects);
      return objects;
    },

    getCategoryList: function(){
      var objects = [];
      _.each(this.models, function (el, i) {
        objects[i] = el.toJSON().tags;
      });
      objects = _.union(objects[0]);
      return objects;
    }

  });

  var collection = new Collection();


  collection.fetch().done(function (res) {
    //console.log(res);
    //console.log(collection.models);
    
    
    // console.log(collection.getByWord('アプリ'));
    // console.log(collection.getByCategory());


    console.log(collection.getByDevice('sp'));
    console.log(collection.getRecent(3));
    console.log(collection.getDeviceList());
    console.log(collection.getCategoryList());
    
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
