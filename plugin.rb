# name: Mumble
# about: Displays channel and user information from a Mumble server
# version: 0.3.0
# authors: Nuno Freitas (nunofreitas@gmail.com)
# url: https://github.com/nunof07/discourse-mumble

enabled_site_setting :mumble_enabled

after_initialize {

  require_dependency File.expand_path("../jobs/mumble_job.rb", __FILE__)

  module ::Mumble

    def self.fetch_data
      if SiteSetting.mumble_enabled && !SiteSetting.mumble_cvp.blank?
        response  = Net::HTTP.get_response(URI(SiteSetting.mumble_cvp))
        SiteSetting.mumble_xml ? Hash.from_xml(response.body) : JSON.parse(response.body)
      end
    end

    class Engine < ::Rails::Engine
      engine_name "mumble"
      isolate_namespace Mumble
    end
  end
    
  Mumble::Engine.routes.draw do
    get  "/list" => "mumble#list"
  end
    
  Discourse::Application.routes.append do
    mount ::Mumble::Engine, at: "/mumble"
  end
    
  require_dependency "application_controller"
  class Mumble::MumbleController < ::ApplicationController
    def list
      render json: {data: Mumble.fetch_data}
    end

  end

}

register_asset "stylesheets/mumble.scss"