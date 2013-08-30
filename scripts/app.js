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

      var isDuplicate = function (str) {
        for (var i = 0, l = words.length; i < l; i++) {
          if (str.toLowerCase() == words[i].toLowerCase()) {
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
      }
      ;

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

    initialize: function () {

    },

    enter: function () {
      listPage.destroy();
      categoryListView.show();
      resultView.show();
    },

    leave: function () {
    }


  });

  var ListPageView = Backbone.View.extend({
    events: {

    },

    initialize: function () {
      this.wordTitle = $(this.el).find('#byWord h2').text();
      this.categoryTitle = $(this.el).find('#byCategory h2').text();
      this.deviceTitle = $(this.el).find('#byDevice h2').text();
    },

    enter: function (word, category) {
      listPage.destroy();
      switch (category) {
        case 'category':
          resultView.renderCategory(word);
          break;
        case 'device':
          resultView.renderDevice(word);
          break;
      }
      categoryListView.hide();
      resultView.hide();
    },

    hide: function(name) {
      var $target = $(this.el).find('.result');
      $target.hide();
      if(name) $('#' + name).show();
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

      //console.log(this.$("input").val(), result.objects);

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
      this.listenTo(collection, 'sync', function () {
        this.renderTagsList();
        this.renderDeviceList();
      });
    },
    renderTagsList: function () {
      var tags = collection.getCategoryList();
      var ul = $('#tagsList ul');
      this.render('category', tags, ul);
    },
    renderDeviceList: function () {
      var devices = collection.getDeviceList();
      var ul = $('#deviceList ul');
      this.render('device', devices, ul);
    },
    render: function (category, items, ul) {
      //var $templateString = $('#categoryTemplate').html();
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
    showCategory: function (e) {
      var url = e.target.getAttribute('href');
      router.navigate(url, { trigger: true });
      return false;
    }
  });


  var ResultView = Backbone.View.extend({
    events: {

    },
    //
    initialize: function () {
      this.listenTo(collection, 'sync', function () {
        this.renderRecent(5);
        this.renderWord();
        this.renderCategory();
        this.renderDevice();
      });
    },
    renderRecent: function (limit) {
      var itemRecent = collection.getRecent(limit);
      var ul = $('#recentList ul');
      this.render(itemRecent, ul);
    },
    renderWord: function (word) {
      var itemWord = collection.getByWord(word);
      var ul = $('#byWord ul');
      this.render(itemWord, ul);
    },
    renderCategory: function (categoryName) {
      var itemCategory = collection.getByCategory(categoryName);
      var ul = $('#byCategory ul');
      var h2 = $('#byCategory h2');
      h2.text(listPage.categoryTitle + ' ' + categoryName);
      this.render(itemCategory, ul);
    },
    renderDevice: function (device) {
      var itemDevice = collection.getByDevice(device);
      var ul = $('#byDevice ul');
      var h2 = $('#byDevice h2');
      h2.text(listPage.deviceTitle + ' ' + device);
      this.render(itemDevice, ul);
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
    }
  });


  var indexPage = new IndexPageView();
  var listPage = new ListPageView({ el: $('#listPageView') });


  ////// YASU
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "list": "list",
      "category/*query": "category",
      "device/*query": "device"
      //"/list/device_:device": "device",
    },
    index: function () {
      indexPage.enter();
      listPage.hide();
      //this.prev = indexPage;
    },
    list: function () {
      //if(this.prev) this.prev.leave();
      //listPage.enter();
      //this.prev = listPage;
    },
    category: function (category) {
      if (this.prev) this.prev.leave();
      listPage.enter(category, 'category');
      listPage.hide( 'byCategory' );
      this.prev = listPage;
    },
    device: function (device) {
      if (this.prev) this.prev.leave();
      listPage.enter(device, 'device');
      listPage.hide( 'byDevice' );
      this.prev = listPage;
    }

  });

  var collection = new Collection();
  collection.fetch();
  var categoryListView = new CategoryListView({ el: $('#categoryList') });
  var resultView = new ResultView({ el: $('#recentList') });
  var router = new Router();
  Backbone.history.start({ pushState: true });


})(window, document, jQuery, Backbone, _);
