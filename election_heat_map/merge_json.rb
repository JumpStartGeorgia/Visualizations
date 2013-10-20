#!/usr/bin/env ruby
require 'json'
require 'fileutils'

# read in the shapes
puts "reading in files"
shape_json = JSON.parse(File.open("2010_precincts_centroids.json", "r") {|f| f.read()})
geo_dream_json = JSON.parse(File.open("geo_dream.json", "r") {|f| f.read()})
unm_json = JSON.parse(File.open("unm.json", "r") {|f| f.read()})
cdm_json = JSON.parse(File.open("cdm.json", "r") {|f| f.read()})

# for each point in shape file (a precinct in a district),
# add json data from parties
puts "looping through each point"
shape_json['features'].each do |point|
	district = point['properties']['District']
	precinct = point['properties']['Precinct']

	geo_dream = geo_dream_json.select{|x| x["district"] == district && x["precinct"] == precinct}
	if geo_dream && !geo_dream.empty?
		point['properties']['geo_dream'] = geo_dream.first["value"]
	else
		puts "- no geo dream data for district = #{district}, precinct = #{precinct}"
		point['properties']['geo_dream'] = 0
	end

	unm = unm_json.select{|x| x["district"] == district && x["precinct"] == precinct}
	if unm && !unm.empty?
		point['properties']['unm'] = unm.first["value"]
	else
		puts "- no unm data for district = #{district}, precinct = #{precinct}"
		point['properties']['unm'] = 0
	end

	cdm = cdm_json.select{|x| x["district"] == district && x["precinct"] == precinct}
	if cdm && !cdm.empty?
		point['properties']['cdm'] = cdm.first["value"]
	else
		puts "- no cdm data for district = #{district}, precinct = #{precinct}"
		point['properties']['cdm'] = 0
	end
end

# now save this file
puts "writing out merged file"
File.open("merged.json", 'w') {|f| f.write(shape_json.to_json)}
