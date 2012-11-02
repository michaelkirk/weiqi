(function(){

  if(typeof exports === "undefined")
    this['weiqi'] = this['weiqi'] || {};
  else
    this['weiqi'] = exports;

  weiqi.CellView = Backbone.View.extend({
    initialize: function(options) {
      this.board_view = options.board_view;

      //render whenever model changes
      _.bindAll(this, "render");
      this.model.bind("change", this.render);

      x_offset = 30;
      y_offset = 35;

      this.x = this.model.get("x") * 31 + x_offset;
      this.y = this.model.get("y") * 32.75 + y_offset;

      this.$el.addClass('jgo_c');
      this.$el.attr('style', 'top: ' + this.y + 'px; left: ' + this.x + 'px;')
    },
    events: {
      "click": "play"
    },
    play: function() {
      if (this.board_view.player_color == "black") {
        this.model.board.play_black(this.model.get('x'), this.model.get('y'));
      } else if (this.board_view.player_color == "white") {
        this.model.board.play_white(this.model.get('x'), this.model.get('y'));
      } else {
        throw new Error("illegal board_view color: " + this.board_view.player_color);
      }
    },
    render: function() {
      if(this.model.get('holds') == 'black') {
        this.$el.removeClass('jgo_w');
        this.$el.addClass('jgo_b');
      }
      else if(this.model.get('holds') == 'white') {
        this.$el.removeClass('jgo_b');
        this.$el.addClass('jgo_w');
      }
      else if (this.model.get('holds') == null) {
        this.$el.removeClass('jgo_w');
        this.$el.removeClass('jgo_b');
      }
      return this.$el;
    }
  });
})();
