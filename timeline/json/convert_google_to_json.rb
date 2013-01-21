#!/usr/bin/env ruby
require 'json'
require 'fileutils'

def build_json_obj (google_json, new_json)
  google_json["feed"]["entry"].each do |entry|
    if entry["gsx$type"]["$t"] == 'title'
      # build the title
      new_json["timeline"]["type"] = "default"
      new_json["timeline"]["headline"] = entry["gsx$headline"]["$t"]
      new_json["timeline"]["text"] = entry["gsx$text"]["$t"]
      new_json["timeline"]["startDate"] = entry["gsx$startdate"]["$t"]
      new_json["timeline"]["asset"] = Hash.new
      new_json["timeline"]["asset"]["media"] = entry["gsx$media"]["$t"]
      new_json["timeline"]["asset"]["credit"] = entry["gsx$mediacredit"]["$t"]
      new_json["timeline"]["asset"]["caption"] = entry["gsx$mediacaption"]["$t"]
      new_json["timeline"]["asset"]["thumbnail"] = entry["gsx$mediathumbnail"]["$t"]
    else
      x = Hash.new
      new_json["timeline"]["date"] << x
      x["type"] = "default"
      x["startDate"] = entry["gsx$startdate"]["$t"]
      x["endDate"] = entry["gsx$enddate"]["$t"]
      x["headline"] = entry["gsx$headline"]["$t"]
      x["text"] = entry["gsx$text"]["$t"]
      x["tag"] = entry["gsx$tag"]["$t"]
      x["asset"] = Hash.new
      x["asset"]["media"] = entry["gsx$media"]["$t"]
      x["asset"]["credit"] = entry["gsx$mediacredit"]["$t"]
      x["asset"]["caption"] = entry["gsx$mediacaption"]["$t"]
      x["asset"]["thumbnail"] = entry["gsx$mediathumbnail"]["$t"]
    end
  end

  return new_json
end

# read in google doc
puts "reading in google doc"
google_en_json = JSON.parse(File.open("google_en.json", "r") {|f| f.read()})
google_ka_json = JSON.parse(File.open("google_ka.json", "r") {|f| f.read()})

# create json output
puts 'creating new json objects'
timeline_en_json = Hash.new
timeline_ka_json = Hash.new

timeline_en_json["timeline"] = Hash.new
timeline_en_json["timeline"]["date"] = Array.new
timeline_ka_json["timeline"] = Hash.new
timeline_ka_json["timeline"]["date"] = Array.new

# build english file
puts 'building english json obj'
timeline_en_json = build_json_obj(google_en_json, timeline_en_json)
=begin
google_en_json["feed"]["entry"].each do |entry|
  if entry["gsx$type"]["$t"] == 'title'
    # build the title
    timeline_en_json["timeline"]["type"] = "default"
    timeline_en_json["timeline"]["headline"] = entry["gsx$headline"]["$t"]
    timeline_en_json["timeline"]["text"] = entry["gsx$text"]["$t"]
    timeline_en_json["timeline"]["startDate"] = entry["gsx$startdate"]["$t"]
    timeline_en_json["timeline"]["media"] = entry["gsx$media"]["$t"]
    timeline_en_json["timeline"]["caption"] = entry["gsx$mediacaption"]["$t"]
    timeline_en_json["timeline"]["credit"] = entry["gsx$mediacredit"]["$t"]
    timeline_en_json["timeline"]["asset"] = Hash.new
    timeline_en_json["timeline"]["asset"]["media"] = entry["gsx$media"]["$t"]
    timeline_en_json["timeline"]["asset"]["credit"] = entry["gsx$mediacredit"]["$t"]
    timeline_en_json["timeline"]["asset"]["caption"] = entry["gsx$mediacaption"]["$t"]
    timeline_en_json["timeline"]["asset"]["thumbnail"] = entry["gsx$mediathumbnail"]["$t"]
  else
    x = Hash.new
    timeline_en_json["timeline"]["date"] << x
    x["type"] = "default"
    x["startDate"] = entry["gsx$startdate"]["$t"]
    x["endDate"] = entry["gsx$enddate"]["$t"]
    x["headline"] = entry["gsx$headline"]["$t"]
    x["text"] = entry["gsx$text"]["$t"]
    x["tag"] = entry["gsx$tag"]["$t"]
    x["asset"] = Hash.new
    x["asset"]["media"] = entry["gsx$media"]["$t"]
    x["asset"]["credit"] = entry["gsx$mediacredit"]["$t"]
    x["asset"]["caption"] = entry["gsx$mediacaption"]["$t"]
    x["asset"]["thumbnail"] = entry["gsx$mediathumbnail"]["$t"]
  end
end
=end

# build georgian file
puts 'building georgian json obj'
timeline_ka_json = build_json_obj(google_ka_json, timeline_ka_json)
=begin
google_ka_json["feed"]["entry"].each do |entry|
  if entry["gsx$type"]["$t"] == 'title'
    # build the title
    timeline_ka_json["timeline"]["type"] = "default"
    timeline_ka_json["timeline"]["headline"] = entry["gsx$headline"]["$t"]
    timeline_ka_json["timeline"]["text"] = entry["gsx$text"]["$t"]
    timeline_ka_json["timeline"]["startDate"] = entry["gsx$startdate"]["$t"]
    timeline_ka_json["timeline"]["media"] = entry["gsx$media"]["$t"]
    timeline_ka_json["timeline"]["caption"] = entry["gsx$mediacaption"]["$t"]
    timeline_ka_json["timeline"]["credit"] = entry["gsx$mediacredit"]["$t"]
  else
    x = Hash.new
    timeline_ka_json["timeline"]["date"] << x
    x["type"] = "default"
    x["startDate"] = entry["gsx$startdate"]["$t"]
    x["endDate"] = entry["gsx$enddate"]["$t"]
    x["headline"] = entry["gsx$headline"]["$t"]
    x["text"] = entry["gsx$text"]["$t"]
    x["tag"] = entry["gsx$tag"]["$t"]
    x["asset"] = Hash.new
    x["asset"]["media"] = entry["gsx$media"]["$t"]
    x["asset"]["credit"] = entry["gsx$mediacredit"]["$t"]
    x["asset"]["caption"] = entry["gsx$mediacaption"]["$t"]
    x["asset"]["thumbnail"] = entry["gsx$mediathumbnail"]["$t"]
  end
end
=end

# now write to file
puts "writing out new json files"
File.open("timeline_en.json", 'w') {|f| f.write(timeline_en_json.to_json)}
File.open("timeline_ka.json", 'w') {|f| f.write(timeline_ka_json.to_json)}


puts "done!"



