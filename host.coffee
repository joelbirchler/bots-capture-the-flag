$(->
  # game settings
  botServer = "http://localhost:4567"
  numberOfRocks = 60

  # board measurements
  gridWidth = 100
  gridHeight = 50
  canvasWidth = $('#canvas').width()
  canvasHeight = $('#canvas').height()
  tileWidth = canvasWidth/gridWidth
  tileHeight = canvasHeight/gridHeight
  canvasCtx = $('#canvas').get(0).getContext('2d')
  
  # setup rocks
  rocks = for i in [1..numberOfRocks]
    {x: Math.floor(Math.random() * gridWidth), y: Math.floor(Math.random() * gridHeight)}
  
  # board functions
  canMoveTo = (x, y) ->
    return false if x < 0 or y < 0 or x > gridWidth - 1 or y > gridHeight - 1
    return false if (_.any(rocks, (rock) -> (x == rock.x and y == rock.y)))
    true
    
  draw = ->
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)
    for rock in rocks
      plotTile(rock.x, rock.y, 100, 100, 100)
    plotTile(bot.x, bot.y, Math.floor(150 + bot.energy), 0, 0)
    
  plotTile = (x, y, r, g, b) ->
    plotX = x * tileWidth
    plotY = y * tileHeight
    canvasCtx.fillStyle = "rgb(#{r},#{g},#{b})"
    canvasCtx.fillRect(plotX, plotY, tileWidth, tileHeight)

  radar = (x, y) ->
    # return a 5,5 grid with x,y in the middle
    
  # the bot
  class Bot
    constructor: ->
      @energy = 100
    go: (callback) ->
      if @energy <= 0
        callback()
        return

      $.getJSON(
        "#{botServer}/turn.json?callback=?", 
        { bot: 0, x: @x, y: @y, energy: @energy }, 
        (data) =>
          [goalX, goalY] = [@x, @y]
          
          if data.x
            goalX += (if data.x > 0 then 1 else -1)
            @energy--
            
          if data.y
            goalY += (if data.y > 0 then 1 else -1)
            @energy--
            
          @energy += 2 unless data.x? or data.y?
          @energy = 0 if @energy < 0
          
          if (@energy and canMoveTo(goalX, goalY))
            bot.x = goalX
            bot.y = goalY

          callback()
          null
      )
      
  
  # fire up a bot
  bot = new Bot()
  bot.x = 50
  bot.y = 25

  # and let's do this...
  draw()

  ding = false
  busy = false
  
  doTurn = ->
    return if not ding or busy
    ding = false
    busy = true
    
    bot.go(-> 
      busy = false
      draw()
      doTurn()
    )

  setInterval((->
    ding = true
    doTurn()), 100)
  
)