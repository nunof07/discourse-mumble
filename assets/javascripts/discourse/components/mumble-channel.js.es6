export default Ember.Component.extend({
	tagName: '',
	data: null,
	expanded: true,
	
	children: function() {
		var data = this.get('data');
		
		if (data) {
			if (data.channels) {
				return data.channels;
			} else if (data.channel) {
				if (Ember.isArray(data.channel)) {
					return data.channel;
				} else {
					return [data.channel];
				}
			}
		}
		
		return [];
	}.property('data'),
	
	usersList: function() {
		var data = this.get('data');
		
		if (data) {
			if (data.users) {
				return data.users;
			} else if (data.user) {
				if (Ember.isArray(data.user)) {
					return data.user;
				} else {
					return [data.user];
				}
			}
		}
		
		return [];
	}.property('data'),
	
	iconClass: function() {
		if (this.get('expanded')) {
			return "fa fa-caret-down";
		}
		
		return "fa fa-caret-right";
	}.property('expanded'),
	
	actions: {
		expand: function() {
			this.set('expanded', !this.get('expanded'));
		}
	}
});
