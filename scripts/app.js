;(function (window, document, $, Backbone, _, undefined) {

  ////// MODEL
  var Model = Backbone.Model.extend({
    initialize: function(){

    },
  });

  var Collection = Backbone.Collection.extend({

    model: Model,

    url: '/data.json',

    getByWord: function(word){
      var objects = [],
          words = [],
          scope = ['summary', 'title', 'creator', 'tags', 'device', 'browser'],
          noIncludeWords = ['summary'],
          //word = word.toLowerCase().replace(/^(?:\s*)?(\S+?)(?:\s*)?$/, '$1'),
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

      var add = function(key, value, model) {
        if (reg.test(value.toLowerCase())) {
          if (!isDuplicate(value) && isIncludeWords(key)) words.push(value);
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
      var objects = [],
          //categoryName = categoryName.toLowerCase().replace(/^(?:\s*)?(\S+?)(?:\s*)?$/, '$1'),
          reg = new RegExp('^\\s*?' + categoryName + '\\s*?$');

      for (var i = 0, l = this.models.length; i < l; i++) {
        var pick = this.models[i].get('tags');
        for (var j = 0, k = pick.length; j < k; j++) {
          if (reg.test(pick[j].toLowerCase())) {
            objects.push(this.models[i].toJSON());
            break;
          }
        }
      };

      return objects;
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

  // collection.fetch().done(function (res) {
  //   console.log('インクリメンタルサーチ');
  //   console.log(collection.getByWord('java'));
  //   console.log('各カテゴリ一覧');
  //   console.log(collection.getByCategory('javascript'));
  //   console.log('各デバイス一覧');
  //   console.log(collection.getByDevice('sp'));
  //   console.log('最新X件');
  //   console.log(collection.getRecent(2));
  //   console.log('デバイスリスト');
  //   console.log(collection.getDeviceList());
  //   console.log('カテゴリリスト');
  //   console.log(collection.getCategoryList());
  // });


  ////// VIEW

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
        'click a': 'showCategory'
    },
    initialize: function(){
      this.listenTo(collection, 'sync', function(){
        this.renderTagsList();
        this.renderDeviceList();
      });
    },
    renderTagsList: function(){
      var tags = collection.getCategoryList();
      var ul = $('#tagsList ul');
      this.render(tags, ul);
    },
    renderDeviceList: function(){
      var devices = collection.getDeviceList();
      var ul = $('#deviceList ul');
      this.render(devices, ul);
    },
    render: function(items, ul){
      var $templateString = $('#categoryTemplate').html();
      var list = _.template($templateString, {obj:items}); // 配列items ⇒ オブジェクトの形にして _.templateに渡す
      ul.append(list);
    },
    showCategory: function(e) {
      var url = e.target.getAttribute('href');
      router.navigate(url, { trigger: true });
      return false;
    }
  });


  var ResultView = Backbone.View.extend({
    events: {

    },
    //
    initialize: function(){
      this.listenTo(collection, 'sync', function(){
        this.renderRecent(5);
        this.renderWord();
        this.renderCategory();
        this.renderDevice();
      });
    },
    renderRecent: function(limit){
      var itemRecent = collection.getRecent(limit);
      var ul = $('#recentList ul');
      this.render(itemRecent, ul);
    },
    renderWord: function(word){
      var itemWord = collection.getByWord(word);
      var ul = $('#byWord ul');
      this.render(itemWord, ul);
    },
    renderCategory: function(categoryName){
      var itemCategory = collection.getByCategory(categoryName);
      var ul = $('#byCategory ul');
      this.render(itemCategory, ul);
    },
    renderDevice: function(device){
      var itemDevice = collection.getByDevice(device);
      var ul = $('#byDevice ul');
      this.render(itemDevice, ul);
    },
    render: function(items, ul){
      var $templateString = $('#resultTemplate').html();
      var list = _.template($templateString, {obj:items});
      ul.append(list);
    }
  });




  ////// YASU
  var Router = Backbone.Router.extend({
    routes: {
      "/": "index",
      "list": "list",
      "device/*query": "device"
      //"/list/device_:device": "device",
    },

    index: function(){
      console.log('index');
    },

    list: function(){
      console.log('list');
    },

    device: function(device){
      console.log('device');
    }

  });

  var collection = new Collection();
  collection.fetch();
  var categoryListView = new CategoryListView({ el: $('#categoryList') });
  var resultView = new ResultView();
  var router = new Router();
  Backbone.history.start({ pushState: true });



})(window, document, jQuery, Backbone, _);
