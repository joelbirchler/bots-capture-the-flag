require 'sinatra'
require 'json'

bot_count = 0

get '/readysetgo.json' do
  bot_count = params[:bots]
  puts "Ready! Set! Go! with #{bot_count} bots!"
  {:readysetgo => true}.to_json
end

get '/gameover.json' do
  puts "Game over!"
  {:gameover => true}.to_json
end

get '/turn.json' do
  puts params.to_json
  {:move => "w", :speed => 1}.to_json
end

