require 'octokit'
require 'pp'

client = Octokit::Client.new(netrc: true)
version = ARGV.last
release = client.get "/repos/voodootikigod/node-serialport/releases/tags/#{version}"
release[:assets].each do |release|
  puts "#{release[:download_count]}\t#{release[:name]}"
end
