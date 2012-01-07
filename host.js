(function() {
  
  var botServer = "http://localhost:4567";
  var gridWidth = 100;
  var gridHeight = 50;
  
  var Bot = function() {
    this.energy = 100;
    
    this.turn = function() {
      var that = this;
      $.getJSON(
        botServer + "/turn.json?callback=?", 
        {
          bot: 0, 
          x: this.x,
          y: this.y,
          energy: this.energy
        }, 
        function(data) {
          console.log("yay!", data)
        }
      );
    }
  }
  
  var bot = new Bot();
  bot.x = 50;
  bot.y = 25;
  bot.turn();
  
})();