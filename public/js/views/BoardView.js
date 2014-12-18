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
      var board_view = this;
      _.each(this.model.cells, function(rows) {
        _.each(rows, function(cell) {
          board_view.cell_views.push(new weiqi.CellView({model: cell, board_view: board_view}));
        });
      });
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
    update_turn: function() {
      if(this.model.whose_turn() == this.player_color) {
        this.$el.addClass("your-turn");
      } else {
        this.$el.removeClass("your-turn");
      }

      $('.jgo_m', this.$el).removeClass('circle_b').removeClass('circle_w');
      var latest_move = this.model.moves.last();
      if(latest_move){
        var cell = this.model.get_cell(latest_move.get('x'), latest_move.get('y'));
        var overlay = cell.view.$el.find('.jgo_m');
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
      _.each(this.cell_views, function(cell_view) {
        // make sure we keep reverse references across 'board-update' events
        // the 'cells' attr of the Board isntance is being reset
        cell_view.model.view = cell_view;
        $(".board", board_view.$el).append(cell_view.render());
      });
      return this.$el;
    }
  });
})();
