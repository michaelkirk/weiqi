(function(){

  if(typeof exports === "undefined")
    this['weiqi'] = this['weiqi'] || {};
  else
    this['weiqi'] = exports;

  weiqi.BoardView = Backbone.View.extend({
    initialize: function(options) {
      options = options || {}
      this.player_color = options['player_color'];
      this.cells = [];
      var board_view = this;
      _.each(this.model.cells, function(rows) {
        _.each(rows, function(cell) {
          board_view.cells.push(new weiqi.CellView({model: cell, board_view: board_view}));
        });
      });
      this.template = _.template('\
        <div class="console"> \
          <div class="banner"> \
            <p>you are</p> \
            <h1><%= player_color %></h1> \
          </div> \
          <ul class="share"> \
          </ul> \
        </div> \
        <div class="board jgo_board"> \
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
      _.each(this.cells, function(cell_view) {
        $(".board", board_view.$el).append(cell_view.render());
      });
      return this.$el;
    }
  });
})();
