;(function (Mumble) {
	Mumble.getServer = function (data) {
		if (data) {
			if (data.server) {
				return data.server;
			} else {
				return data;
			}
		}
		
		return {};
	};
	
	Mumble.getRootChannel = function (data) {
		if (data) {
			if (data.root) {
				return data.root;
			} else if (data.channel) {
				return data.channel;
			}
		}
		
		return {};
	};
	
	Mumble.getChannels = function (channel) {
		if (channel) {
			if (channel.channels) {
				return channel.channels;
			} else if (channel.channel) {
				if (Ember.isArray(channel.channel)) {
					return channel.channel;
				} else {
					return [channel.channel];
				}
			}
		}
		
		return [];
	};
	
	Mumble.getUsers = function (channel) {
		if (channel) {
			if (channel.users) {
				return channel.users;
			} else if (channel.user) {
				if (Ember.isArray(channel.user)) {
					return channel.user;
				} else {
					return [channel.user];
				}
			}
		}
		
		return [];
	};
	
	Mumble.countUsers = function (channel, recursive) {
		var count = 0,
			users = Mumble.getUsers(channel);
		
		count += users.length;
		
		if (recursive) {
			var channels = Mumble.getChannels(channel);
			
			for (var i = 0; i < channels.length; i +=1) {
				count += Mumble.countUsers(channels[i], true);
			}
		}
		
		return count;
	};
	
}(window.Mumble = {}));