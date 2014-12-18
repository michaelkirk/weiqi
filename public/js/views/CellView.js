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

      x_offset = 28;
      y_offset = 28;

      this.x = this.model.get("x") * 33.9 + x_offset;
      this.y = this.model.get("y") * 33.9 + y_offset;

      this.$el.addClass('cell');
      this.$el.attr('style', 'top: ' + this.y + 'px; left: ' + this.x + 'px;')
      this.$el.append($('<div class="jgo_m"></div>'));
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
        this.$el.removeClass('white');
        this.$el.addClass('black');
      }
      else if(this.model.get('holds') == 'white') {
        this.$el.removeClass('black');
        this.$el.addClass('white');
      }
      else if (this.model.get('holds') == null) {
        this.$el.removeClass('black');
        this.$el.removeClass('white');
      }
      return this.$el;
    }
  });
})();
