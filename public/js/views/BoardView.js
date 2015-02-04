(function(){

  if(typeof exports === "undefined")
    this['weiqi'] = this['weiqi'] || {};
  else
    this['weiqi'] = exports;

  weiqi.BoardView = Backbone.View.extend({
    initialize: function(options) {
      options = options || {}
      this.player_color = options['player_color'];

      this.cell_views = [];
      for(var x = 0; x < this.model.get('width'); x++){
        this.cell_views[x] = [];
        for(var y = 0; y < this.model.get('width'); y++){
          var cell = this.model.get_cell(x, y);
          var new_cell_view = new weiqi.CellView({model: cell, board_view: this});
          this.cell_views[x][y] = new_cell_view;
        }
      }

      this.template = _.template('\
        <div class="board board<%= width %>"> \
        </div> \
        <div class="console"> \
          <div class="banner"> \
            <p>you are</p> \
            <h1><%= player_color %></h1> \
          </div> \
          <ul class="share"> \
          </ul> \
        </div> \
      ');
      
      this.share_template = _.template('\
        <li class="<%= share_class %>"><%= message %>\
          <a href="<%= url %>"><%= url %></a>\
        </li>\
        ');

      _.bindAll(this, "update_turn");
      this.model.bind("change", this.update_turn);

      this.render();
    },
    get_cell_view: function(x, y) {
      if(x < this.model.get('width') && y < this.model.get('width')){
        return this.cell_views[x][y];
      }
      else {
        throw new Error("attempting to accessing outside of game board");
      }
    },
    update_turn: function() {
      if(this.model.whose_turn() == this.player_color) {
        this.$el.addClass("your-turn");
      } else {
        this.$el.removeClass("your-turn");
      }
      this.indicate_latest_move();

    },
    indicate_latest_move: function(){

      var latest_move = this.model.moves.last();

      $('.jgo_m', this.$el).removeClass('circle_b').removeClass('circle_w');
      if(latest_move){

        var cell = this.model.get_cell(latest_move.get('x'), latest_move.get('y'));
        var cell_view = this.get_cell_view(latest_move.get('x'), latest_move.get('y'));

        var overlay = cell_view.$el.find('.jgo_m');
        if(cell.get('holds') == "white")
          $(overlay).addClass("circle_b");
        else
          $(overlay).addClass("circle_w");
      }
    },
    render: function(){
      var template_attributes = _.extend({player_color: this.player_color}, this.model.toJSON());
      var html = this.template(template_attributes);
      this.$el.html(html);
      this.$el.addClass(this.player_color);

      this.update_turn();

      if (this.player_color == "white") {
        opponent_link_attributes = {
          message: 'send your oponent this url:', 
          url: this.model.invitation_url(), 
          share_class: "black"
        };
        opponent_link_html = this.share_template(opponent_link_attributes);
        $(".share", this.$el).append(opponent_link_html);
      }

      var board_view = this;
      _(this.cell_views).chain()
      .flatten()
      .each(function(cell_view) {
        $(".board", board_view.$el).append(cell_view.render());
      });

      return this.$el;
    }
  });
})();
