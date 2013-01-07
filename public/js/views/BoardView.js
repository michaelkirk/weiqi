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
          var cellView = new weiqi.CellView({model: cell, board_view: board_view});
          board_view.cells.push(cellView);
          cell.view = cellView;
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
      this.model.bind("play", this.update_turn);

      this.render();
    },

    update_turn: function(move, previous_move) {
      if(this.model.whose_turn() == this.player_color) {
        this.$el.addClass("your-turn");
      } else {
        this.$el.removeClass("your-turn");
      }

      console.log(move, previous_move)
      if(move){
        var cell = this.model.get_cell(move.get('x'), move.get('y'));
          debugger
        if(cell.get('holds') == "white")
          cell.view.$el.css('border','solid 1px black')
        else
          cell.view.$el.css('border','solid 1px white')
      }

      if(previous_move){
        var prev_cell = this.model.get_cell(previous_move.get('x'), previous_move.get('y'));
        prev_cell.view.$el.css('border', 'none');
        prev_cell.view.$el.css('border', 'none');
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
