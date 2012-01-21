require 'rubygems'
require 'sinatra'
require 'sinatra/jsonp'
require 'json'

bot_count = 0

get '/readysetgo.json' do
  bot_count = params[:bots]
  puts "Ready! Set! Go! with #{bot_count} bots!"
  jsonp({:readysetgo => true})
end

get '/gameover.json' do
  puts "Game over!"
  jsonp({:gameover => true})
end

get '/turn.json' do
  puts params.to_json
  if params[:energy].to_i < 10
    jsonp({:x => 0, :y => 0})
  else
    jsonp({:x => rand(3)-1, :y => rand(3)-1})
  end
end

