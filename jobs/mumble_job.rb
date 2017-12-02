module Jobs
  class MumbleJob < Jobs::Scheduled
    sidekiq_options retry: false
    every 1.minutes

    def execute(_args)

      MessageBus.publish("/mumble", {data: Mumble.fetch_data})

    end
  end
end