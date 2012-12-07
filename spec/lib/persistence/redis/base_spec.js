var assert = require("assert");
var Base = require('../../../../lib/persistence/redis/Base');

describe('Base', function() {
  it("should provide a way to save a fetch models to redis", function(done) {
    var SomeModel = Base({ model: Backbone.Model.extend({}), name: 'some_model' });

    var some_instance = new SomeModel({ some_attr: 'some_value' });
    var some_other_instance;

    some_instance.save().then(function() {
      return some_instance.fetch();
    }).then(function() {
      some_other_instance = new SomeModel({ id: some_instance.id });
      return some_other_instance.fetch();
    }).then(function() {
      assert.equal('some_value', some_other_instance.get('some_attr'));
      done();
    }).fail(function(err) {
      console.log(err);
    });
  });
});
