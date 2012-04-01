(function(){

  if(typeof exports === "undefined")
    this['weiqi'] = this['weiqi'] || {};
  else
    this['weiqi'] = exports;

  weiqi.CellView = Backbone.View.extend({
    tagName: "div",
    initialize: function(cell, board_view) {
      this.board_view = board_view;
      this.cell = cell;
      x_offset = 30;
      y_offset = 35;

      this.x = cell.get("x") * 31 + x_offset;
      this.y = cell.get("y") * 32.75 + y_offset;

      this.$el.addClass('jgo_c');
      this.$el.attr('style', 'top: ' + this.y + 'px; left: ' + this.x + 'px;"')
    },
    render: function() {
      if(this.cell.get('holds') == 'black') {
        this.$el.removeClass('jgo_w');
        this.$el.addClass('jgo_b');
      }
      else if(this.cell.get('holds') == 'white') {
        this.$el.removeClass('jgo_b');
        this.$el.addClass('jgo_w');
      }
      else if (this.cell.get('holds') == null) {
        this.$el.removeClass('jgo_w');
        this.$el.removeClass('jgo_b');
      }
      return this.$el;
    }
  });
})();
