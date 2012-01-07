$(function() {
  
  var botServer = "http://localhost:4567";
  var gridWidth = 100;
  var gridHeight = 50;
  var canvasWidth = $('#canvas').width();
  var canvasHeight = $('#canvas').height();
  var tileWidth = canvasWidth/gridWidth;
  var tileHeight = canvasHeight/gridHeight;
  
  var canvasCtx = $('#canvas').get(0).getContext('2d');  
  
  var Bot = function() {
    this.energy = 100;
    
    this.draw = function() {
      var plotX = this.x * tileWidth, plotY = this.y * tileHeight;
      canvasCtx.fillStyle = "rgb(200,0,0)";  
      canvasCtx.fillRect (plotX, plotY, tileWidth, tileHeight);
    }
    
    this.canMoveTo = function (x, y) {
      return true;
    }
    
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
          var goalX = that.x, goalY = that.y;
          switch (data['move']) {
            case 'n': 
              goalY--; that.energy--; break;
            case 's': 
              goalY++; that.energy--; break;
            case 'w': 
              goalX--; that.energy--; break;
            case 'e': 
              goalX++; that.energy--; break;
            default:
              that.energy++;
          }
          if (that.canMoveTo(goalX, goalY)) {
            that.x = goalX;
            that.y = goalY;
            that.draw();
          }
        }
      );
    }
  }
  
  var bot = new Bot();
  bot.x = 50;
  bot.y = 25;
  
  bot.draw();
  bot.turn();
  
});