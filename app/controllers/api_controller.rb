# coding: utf-8
class ApiController < ApplicationController

  def parse_video
    pkg = params[:pkg]

    require 'open-uri'
    link = Nokogiri::HTML(open("https://play.google.com/store/apps/details?id="+pkg))
    video = link.css('.preview-overlay-container')[0]['data-video-url'].split('?')[0]
    # preview-overlay-container

    if params[:pkg].present?
      render text: video
    else
      render text: 'You should use pkg parameter'
    end
  end

end