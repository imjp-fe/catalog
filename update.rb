#! ruby -Ku
# -*- mode:ruby; coding:utf-8 -*- 
=begin
(c)おおた
ruby 1.9- で動くはずです。
バグあれば受け付けます。
=end

require 'json'

config = {
  :src => 'json/*json',
  :dest => 'data.json',
  :private_key => '~/.ssh/fedev_imjusr.com.pem',
  :remote => '/home/www/dev/htdocs'
}

class JsonParser
  def read(file)
    File.open(file, "r") { |io| 
      return JSON.load(io)
    }
  end
  def write(file, content)
    File.open(file, "w") do |io|
      io.puts content
    end
  end
  def check(hash)
    if hash.size == 14 then
      return true
    else
      return false
    end
  end
end

jsonParser = JsonParser.new
jsons = []
errors = []

Dir.glob(config[:src]) { |file| 
  json = jsonParser.read(file)
  if jsonParser.check(json) then
    jsons.push(json)
  else
    errors.push(file)
  end
}

if errors.size == 0 then
  dump = JSON.pretty_generate(jsons)
  jsonParser.write(config[:dest], dump)
  command = "scp -P 10022 -i #{config[:private_key]} #{config[:dest]} fedev@49.212.45.118:#{config[:remote]}"
  exec(command)
else
  p 'hash size error!'
  jsonParser.write('error.txt', errors)
end
