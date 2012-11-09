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
          <p>you are</p> \
          <h1><%= player_color %></h1> \
          <ul class="share"> \
          </ul> \
        </div> \
        <div class="board jgo_board"> \
        </div> \
      ');

      this.share_template = _.template('\
        <li><%= message %>\
          <a href="<%= url %>"><%= url %></a>\
        </li>\
        ');

      this.render();
    },
    render: function(){
      var template_attributes = _.extend({player_color: this.player_color}, this.model.toJSON());
      var html = this.template(template_attributes);
      this.$el.html(html);

      if (this.player_color == "white") {
        $(".share", this.$el).append(this.share_template({message: 'send your oponent this url:', url: "black"}));
      }

      var board_view = this;
      _.each(this.cells, function(cell_view) {
        $(".board", board_view.$el).append(cell_view.render());
      });
      return this.$el;
    }
  });
})();
