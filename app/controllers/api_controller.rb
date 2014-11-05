# coding: utf-8
class ApiController < ApplicationController

  before_filter :set_access_control_headers

  def set_access_control_headers
    headers["Access-Control-Allow-Origin"] = "*"
    headers["Access-Control-Allow-Methods"] = %w{GET POST PUT DELETE}.join(",")
    headers["Access-Control-Allow-Headers"] = %w{Origin Accept Content-Type X-Requested-With X-CSRF-Token}.join(",")
    head(:ok) if request.request_method == "OPTIONS"
  end

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