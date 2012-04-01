(function(){

  if(typeof exports === "undefined")
    this['weiqi'] = this['weiqi'] || {};
  else
    this['weiqi'] = exports;

  weiqi.BoardView = Backbone.View.extend({
    tagName: "div",
    initialize: function() {
      this.cells = [];
      var board_view = this;
      _.each(this.model.get('cells'), function(rows) {
        _.each(rows, function(cell) {
          board_view.cells.push(new weiqi.CellView({model: cell}));
        });
      });

      this.$el.addClass('jgo_board');
      this.render();
    },
    render: function(){
      board_view = this;
      _.each(this.cells, function(cell_view) {
        board_view.$el.append(cell_view.render());
      });
    }
  });
})();
