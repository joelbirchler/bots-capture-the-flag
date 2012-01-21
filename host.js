$(function() {
  
  var botServer = "http://localhost:4567",
    numberOfRocks = 60;
  
  var gridWidth = 100,
    gridHeight = 50,
    canvasWidth = $('#canvas').width(),
    canvasHeight = $('#canvas').height(),
    tileWidth = canvasWidth/gridWidth,
    tileHeight = canvasHeight/gridHeight,
    canvasCtx = $('#canvas').get(0).getContext('2d');
    
  var rocks = [];
  _.times(numberOfRocks, function(){
    rocks.push(randomCoordinate())
  });
  
  function randomCoordinate() {
    return {x: Math.floor(Math.random() * gridWidth), y: Math.floor(Math.random() * gridHeight)}
  }
  
  function canMoveTo(x, y) {
    if (x < 0 || y < 0 || x > gridWidth - 1 || y > gridHeight - 1 ) { return false; }
    if (_.any(rocks, function(rock) {return (x === rock.x && y === rock.y);})) { return false; }
    
    return true;
  }
  
  function draw() {
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    _.each(rocks, function(rock) {
      plotTile(rock.x, rock.y, 100, 100, 100);
    });
    
    plotTile(bot.x, bot.y, Math.floor(150 + bot.energy), 0, 0);
  }
  
  function plotTile(x, y, r, g, b) {
    var plotX = x * tileWidth, plotY = y * tileHeight;
    canvasCtx.fillStyle = "rgb("+r+","+g+","+b+")";  
    canvasCtx.fillRect (plotX, plotY, tileWidth, tileHeight);
  }
  
  function radar(x, y) {
    // return a 5,5 grid with x,y in the middle
  }
  
  var Bot = function() {
    this.energy = 100;
  }
  
  Bot.prototype.go = function(callback) {
    if (this.energy <= 0) { callback(); }
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
        if (data['x']) { goalX += (data['x'] > 0 ? 1 : -1);  that.energy--; }
        if (data['y']) { goalY += (data['y'] > 0 ? 1 : -1);  that.energy--; }
        if (!data['x'] && !data['y']) { that.energy += 2; }
        if ( that.energy < 0 ) { that.energy = 0; }
        
        if (that.energy && canMoveTo(goalX, goalY)) {
          bot.x = goalX;
          bot.y = goalY;
        }
        
        callback();
      }
    );
  }
  
  var bot = new Bot();
  bot.x = 50;
  bot.y = 25;
  
  draw();
  var ding = false, busy = false;
  var doTurn = function() {
    if (!ding || busy) { return; }
    ding = false; busy = true;
    bot.go(function() { 
      busy = false;
      draw();
      doTurn();
    });
  }
  setInterval(function() { ding = true; doTurn(); }, 100);  
  

});