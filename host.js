(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    var Bot, bot, botServer, busy, canMoveTo, canvasCtx, canvasHeight, canvasWidth, ding, doTurn, draw, gridHeight, gridWidth, i, numberOfRocks, plotTile, radar, rocks, tileHeight, tileWidth;
    botServer = "http://localhost:4567";
    numberOfRocks = 60;
    gridWidth = 100;
    gridHeight = 50;
    canvasWidth = $('#canvas').width();
    canvasHeight = $('#canvas').height();
    tileWidth = canvasWidth / gridWidth;
    tileHeight = canvasHeight / gridHeight;
    canvasCtx = $('#canvas').get(0).getContext('2d');
    rocks = (function() {
      var _results;
      _results = [];
      for (i = 1; 1 <= numberOfRocks ? i <= numberOfRocks : i >= numberOfRocks; 1 <= numberOfRocks ? i++ : i--) {
        _results.push({
          x: Math.floor(Math.random() * gridWidth),
          y: Math.floor(Math.random() * gridHeight)
        });
      }
      return _results;
    })();
    canMoveTo = function(x, y) {
      if (x < 0 || y < 0 || x > gridWidth - 1 || y > gridHeight - 1) {
        return false;
      }
      if (_.any(rocks, function(rock) {
        return x === rock.x && y === rock.y;
      })) {
        return false;
      }
      return true;
    };
    draw = function() {
      var rock, _i, _len;
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      for (_i = 0, _len = rocks.length; _i < _len; _i++) {
        rock = rocks[_i];
        plotTile(rock.x, rock.y, 100, 100, 100);
      }
      return plotTile(bot.x, bot.y, Math.floor(150 + bot.energy), 0, 0);
    };
    plotTile = function(x, y, r, g, b) {
      var plotX, plotY;
      plotX = x * tileWidth;
      plotY = y * tileHeight;
      canvasCtx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      return canvasCtx.fillRect(plotX, plotY, tileWidth, tileHeight);
    };
    radar = function(x, y) {};
    Bot = (function() {
      function Bot() {
        this.energy = 100;
      }
      Bot.prototype.go = function(callback) {
        if (this.energy <= 0) {
          callback();
          return;
        }
        return $.getJSON("" + botServer + "/turn.json?callback=?", {
          bot: 0,
          x: this.x,
          y: this.y,
          energy: this.energy
        }, __bind(function(data) {
          var goalX, goalY, _ref;
          _ref = [this.x, this.y], goalX = _ref[0], goalY = _ref[1];
          if (data.x) {
            goalX += (data.x > 0 ? 1 : -1);
            this.energy--;
          }
          if (data.y) {
            goalY += (data.y > 0 ? 1 : -1);
            this.energy--;
          }
          if (!((data.x != null) || (data.y != null))) {
            this.energy += 2;
          }
          if (this.energy < 0) {
            this.energy = 0;
          }
          if (this.energy && canMoveTo(goalX, goalY)) {
            bot.x = goalX;
            bot.y = goalY;
          }
          callback();
          return null;
        }, this));
      };
      return Bot;
    })();
    bot = new Bot();
    bot.x = 50;
    bot.y = 25;
    draw();
    ding = false;
    busy = false;
    doTurn = function() {
      if (!ding || busy) {
        return;
      }
      ding = false;
      busy = true;
      return bot.go(function() {
        busy = false;
        draw();
        return doTurn();
      });
    };
    return setInterval((function() {
      ding = true;
      return doTurn();
    }), 100);
  });
}).call(this);
