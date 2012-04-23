var _init = function(weiqi){

  weiqi.Player = this.Backbone.Model.extend({
    activeBoard = null,
    username = null,
    defaults = {
      logged_in = false;
    }, 
  })

  return weiqi
}

if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}
else
  module.exports = _init;
