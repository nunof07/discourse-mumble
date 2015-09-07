# name: mumble
# about: Displays channel and user information from a Mumble server
# version: 0.1.1
# authors: Nuno Freitas (nunofreitas@gmail.com)
# url: https://github.com/nunof07/discourse-mumble

register_asset "javascripts/mumble.js"
register_asset "stylesheets/mumble.scss"

enabled_site_setting :mumble_enabled

MUMBLE_PLUGIN_NAME ||= "mumble".freeze

after_initialize do
    module ::Mumble
        class Engine < ::Rails::Engine
            engine_name MUMBLE_PLUGIN_NAME
            isolate_namespace Mumble
        end
    end
    
    Mumble::Engine.routes.draw do
        get  "/list"    => "mumble#list"
    end
    
    Discourse::Application.routes.append do
        mount ::Mumble::Engine, at: "/mumble"
    end
    
    require_dependency "application_controller"
    
    class ::Mumble::MumbleController < ::ApplicationController
        requires_plugin MUMBLE_PLUGIN_NAME
        
        rescue_from 'StandardError' do |e| render_json_error e.message end
        
        def list
            if SiteSetting.mumble_cvp.to_s == ''
                result = {}
            else
                response = Net::HTTP.get_response(URI.parse(SiteSetting.mumble_cvp))
                
                if SiteSetting.mumble_xml
                    result = Hash.from_xml(response.body).to_json
                else
                    result = JSON.parse(response.body)
                end
            end
            
            render json: result
        end
    end
end
