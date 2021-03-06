;
(function (window, document, $, Backbone, _, undefined) {

  ////// MODEL
  var Model = Backbone.Model.extend({
    initialize: function () {

    }
  });

  var Collection = Backbone.Collection.extend({

    model: Model,

    url: '/data.json',

    getByWord: function (word) {
      var objects = [],
          words = [],
          scope = ['summary', 'title', 'creator', 'tags', 'device', 'browser'],
          noIncludeWords = ['summary'],
          word = (!word) ? word : word.toLowerCase().replace(/^(?:\s*)?(\S+?)(?:\s*)?$/, '$1'),
          reg = new RegExp('\\s*?' + word + '\\s*?');

      var isDuplicateWords = function (str) {
        for (var i = 0, l = words.length; i < l; i++) {
          if (str.toLowerCase() == words[i].toLowerCase()) {
            return true;
          }
        }
        return false;
      };

      var isDuplicateModel = function (model) {
        for (var i = 0, l = objects.length; i < l; i++) {
          if (objects[i] == model) {
            return true;
          }
        }
        return false;
      };      

      var isIncludeWords = function (str) {
        for (var i = 0, l = noIncludeWords.length; i < l; i++) {
          if (str.toLowerCase() == noIncludeWords[i].toLowerCase()) {
            return false;
          }
        }
        return true;
      }

      var add = function (key, value, model) {
        if (reg.test(value.toLowerCase())) {
          if (! isDuplicateWords(value) && isIncludeWords(key)) words.push(value);
          if (! isDuplicateModel(model)) objects.push(model);
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

      _.each(objects, function(v, k, l) {
        objects[k] = v.toJSON();
      });

      return { objects: objects, words: words };
    },

    getByCategory: function (categoryName) {
      var objects = [],
          categoryName = (!categoryName) ? categoryName : categoryName.toLowerCase().replace(/^(?:\s*)?(\S+?)(?:\s*)?$/, '$1'),
          reg = new RegExp('^\\s*?' + categoryName + '\\s*?$');

      for (var i = 0, l = this.models.length; i < l; i++) {
        var pick = this.models[i].get('tags');
        for (var j = 0, k = pick.length; j < k; j++) {
          if (reg.test(pick[j].toLowerCase())) {
            objects.push(this.models[i].toJSON());
            break;
          }
        }
      }
      ;
      return objects;
    },

    getByDevice: function (device) {
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

    getRecent: function (limit) {
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

    getDeviceList: function () {
      var objects = [];
      var tagObject = [];
      _.each(this.models, function (el, i) {
        //objects[i] = el.toJSON().device;
        objects = el.toJSON().device.join(',').split(',');
        _.each(objects, function (value) {
          var reg = new RegExp(value, 'i');
          if (!reg.test(tagObject.join(), i)) {
            tagObject.push(value);
          }
        })
      });
      //objects = _.uniq(objects);
      return tagObject;
    },

    getCategoryList: function () {
      var objects = [];
      var tagObject = [];
      _.each(this.models, function (el, i) {
        //objects[i] = el.toJSON().tags;
        objects = el.toJSON().tags.join(',').split(',');
        _.each(objects, function (value) {
          var reg = new RegExp(value, 'i');
          if (!reg.test(tagObject.join(), i)) {
            tagObject.push(value);
          }
        })
      });
      //objects = _.union(objects[0]);
      return tagObject;
    }

  });


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
  var ListPageView = Backbone.View.extend({
    events: {

    },
    initialize: function (word, category) {
      this.wordTitle = $(this.el).find('#byWord h2').text();
      this.categoryTitle = $(this.el).find('#byCategory h2').text();
      this.deviceTitle = $(this.el).find('#byDevice h2').text();
    },
    enter: function (word, category) {
      this.listenTo(this.collection, 'sync', function () {
        this.destroy();
        switch (category) {
          case 'category':
            this.renderCategory(word);
            break;
          case 'device':
            this.renderDevice(word);
            break;
        }
      });
    },
    renderWord: function (word) {
      var itemWord = this.collection.getByWord(word);
      var ul = $('#byWord ul');
      this.render(itemWord, ul);
    },
    renderCategory: function (categoryName) {
      var itemCategory = this.collection.getByCategory(categoryName);
      var ul = $('#byCategory ul');
      var h2 = $('#byCategory h2');
      h2.text(this.categoryTitle + ' ' + categoryName);
      this.render(itemCategory, ul);
    },
    renderDevice: function (deviceName) {
      var itemDevice = this.collection.getByDevice(deviceName);
      var ul = $('#byDevice ul');
      var h2 = $('#byDevice h2');
      h2.text(this.deviceTitle + ' ' + deviceName);
      this.render(itemDevice, ul);
    },
    render: function (items, ul) {
      var $templateString = $('#resultTemplate').html();
      var list = _.template($templateString, {obj: items});
      ul.append(list);
    },
    hide: function () {
      var $target = $(this.el).find('.result');
      $target.hide();
    },
    show: function (name) {
      if (name) {
        $('#' + name).show();
      } else {
        var $target = $(this.el).find('.result');
        $target.show();
      }
    },
    destroy: function () {
      var $target = $(this.el).find('.result ul');
      $target.empty();
    },
    leave: function () {

    }
  });

  var SearchView = Backbone.View.extend({
    el: "#search",
    events: {
      "keyup input": "onKey"
    },

    initialize: function () {
    },

    onKey: function (e) {
      var val = this.$("input").val(),
          tmpl = this.$("#searchCandidateTemplate").text(),
          result = collection.getByWord(val),
          str = _.template(tmpl, result);

      if (!val || val == "") str = "";
      this.$("ul").html(str);
    }
  });

  new SearchView();

  var CategoryListView = Backbone.View.extend({
    events: {
      'click a': 'showCategory'
    },
    initialize: function () {

    },
    enter: function () {
      this.listenTo(this.collection, 'sync', function () {
        this.destroy();
        this.renderTagsList();
        this.renderDeviceList();
      });
    },
    renderTagsList: function () {
      var tags = this.collection.getCategoryList();
      var ul = $('#tagsList ul');
      this.render('category', tags, ul);
    },
    renderDeviceList: function () {
      var devices = this.collection.getDeviceList();
      var ul = $('#deviceList ul');
      this.render('device', devices, ul);
    },
    render: function (category, items, ul) {
      var $templateString = $('#' + category + 'Template').html();
      var list = _.template($templateString, {obj: items}); // 配列items ⇒ オブジェクトの形にして _.templateに渡す
      ul.append(list);
    },
    hide: function () {
      $(this.el).fadeOut('fast');
    },
    show: function () {
      $(this.el).fadeIn('fast');
    },
    destroy: function () {
      var $target = $(this.el).find('ul');
      $target.empty();
    },
    showCategory: function (e) {
      var url = e.target.getAttribute('href');
      router.navigate(url, { trigger: true });
      return false;
    }
  });


  var ResultView = Backbone.View.extend({
    events: {

    },
    initialize: function () {

    },
    enter: function (limit) {
      this.listenTo(this.collection, 'sync', function () {
        this.destroy();
        this.renderRecent(limit);
      });
    },
    renderRecent: function (limit) {
      var itemRecent = this.collection.getRecent(limit);
      var ul = $('#recentList ul');
      this.render(itemRecent, ul);
    },
    render: function (items, ul) {
      var $templateString = $('#resultTemplate').html();
      var list = _.template($templateString, {obj: items});
      ul.append(list);
    },
    hide: function () {
      $(this.el).fadeOut('fast');
    },
    show: function () {
      $(this.el).fadeIn('fast');
    },
    destroy: function () {
      var $target = $(this.el).find('ul');
      $target.empty();
    }
  });


  ////// YASU
  var Router = Backbone.Router.extend({
    initialize: function () {
      this.collection = new Collection();
      this.categoryListView = new CategoryListView({ el: '#categoryList', collection: this.collection });
      this.resultView = new ResultView({ el: '#recentList', collection: this.collection });
      this.listPageView = new ListPageView({ el: '#listPage', collection: this.collection });
    },
    routes: {
      "": "index",
      "list": "list",
      "category/*query": "category",
      "device/*query": "device"
      //"/list/device_:device": "device",
    },
    index: function () {
      this.listPageView.hide();
      this.resultView.show();
      this.categoryListView.show();
      this.categoryListView.enter();
      this.resultView.enter(5);
      this.collection.fetch();
    },
    list: function () {
      this.collection.fetch();
      this.resultView.enter();
      this.listPageView.hide();
      this.categoryListView.hide();
    },
    category: function (category) {
      this.resultView.hide();
      this.categoryListView.hide();
      this.listPageView.enter(category, 'category');
      this.listPageView.hide();
      this.listPageView.show('byCategory');
      this.collection.fetch();
    },
    device: function (device) {
      this.resultView.hide();
      this.categoryListView.hide();
      this.listPageView.hide();
      this.listPageView.enter(device, 'device');
      this.listPageView.show('byDevice');
      this.collection.fetch();
    }

  });

  var collection = new Collection();
  collection.fetch();
  var router = new Router();
  Backbone.history.start({ pushState: true });

})(window, document, jQuery, Backbone, _);
