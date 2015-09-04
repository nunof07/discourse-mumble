export default Ember.Component.extend({
	tagName: '',
	dropdownVisible: false,
	server: null,
	
	userCount: function() {
		var root = this.get('rootChannel');
		
		if (root) {
			var	count = root.users ? root.users.length : root.user ? (Ember.isArray(root.user) ? root.user.length : 1): 0,
				iterate = function (channel) {
					if (channel && typeof channel === "object") {
						var userProperty = channel.users ? "users" : "user",
							childrenProperty = channel.channels ? "channels" : "channel";
						
						if (channel.hasOwnProperty(userProperty)) {
							if (Ember.isArray(channel[userProperty])) {
								count += channel[userProperty].length;
							} else {
								count += 1;
							}
						}
						
						if (channel.hasOwnProperty(childrenProperty)) {
							if (Ember.isArray(channel[childrenProperty])) {
								for (var i = 0; i < channel[childrenProperty].length; i +=1) {
									iterate(channel[childrenProperty][i]);
								}
							} else {
								iterate(channel[childrenProperty]);
							}
						}
					}
				};
			iterate(root);
	
			return count;
		} else {
			return 0;
		}
	}.property('server'),
	
	rootChannel: function() {
		var data = this.get('server');
		
		if (data) {
			if (data.root) {
				return data.root;
			} else if (data.channel) {
				return data.channel;
			}
		}
		
		return {};
	}.property('server'),
	
	_refreshService: function () {
		var _this = this,
			interval = Discourse.SiteSettings.mumble_interval > 0 ? Discourse.SiteSettings.mumble_interval : 30000;
			
		Discourse.ajax('/mumble/list.json')
				 .then(function (data) {
					 _this.set('server', data && data.server ? data.server : data);
				 });
		
		Ember.run.later(this, function() {
			_this._refreshService();
		}, interval);
	},
	_init: function() {
		this._refreshService();
	}.on('init')
});
