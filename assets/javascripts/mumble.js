;(function (Mumble) {
	Mumble.getRootChannel = function (data) {
		if (data) {
			if (data.root) {
				return data.root;
			} else if (data.server && data.server.channel) {
				return data.server.channel;
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
	
	Mumble.countUsers = function (root, recursive) {
		var count = 0;
		
		if (recursive) {
			var iterate = function (channel) {
					var users = Mumble.getUsers(channel),
						channels = Mumble.getChannels(channel);
						
					count += users.length;
					
					for (var i = 0; i < channels.length; i +=1) {
						iterate(channels[i]);
					}
				};
					
			iterate(root);
		} else {
			var users = Mumble.getUsers(root);
			
			count += users.length;
		}
		
		return count;
	};
	
}(window.Mumble = {}));