var assert = require("assert");
var Base = require('../../../../lib/persistence/mongo/Base');
var underscore = require('underscore');
var Backbone = require('backbone');

describe('Base', function() {
  it("should provide a way to save a fetch models to redis", function(done) {
    var SomeModel = Base({ model: Backbone.Model.extend({collection_name: "some_models"}),  name: 'some_model' });

    var some_instance = new SomeModel({ some_attr: 'some_value' });
    var some_other_instance;

    some_instance.save().then(function(saved_result) {
      return some_instance.fetch();
    }).then(function(fetched_result) {
      some_other_instance = new SomeModel({ _id: some_instance.id });
      return some_other_instance.fetch();
    }).then(function(fetched_result) {
      assert.equal('some_value', some_other_instance.get('some_attr'));
      done();
    }).fail(function(err) {
      console.log(err);
    });
  });
});
