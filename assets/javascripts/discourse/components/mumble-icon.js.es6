export default Ember.Component.extend({
	tagName: '',
	dropdownVisible: false,
	server: null,
	
	rootChannel: function() {
		return Mumble.getRootChannel(this.get('server'));
	}.property('server'),
	
	userCount: function () {
		return Mumble.countUsers(this.get('rootChannel'), true);
	}.property('rootChannel'),
	
	_refreshService: function () {
		var _this = this,
			interval = Discourse.SiteSettings.mumble_interval > 0 ? Discourse.SiteSettings.mumble_interval : 60000;
			
		Discourse.ajax('/mumble/list.json')
				 .then(function (data) {
					 _this.set('server', data);
				 });
		
		Ember.run.later(this, function() {
			_this._refreshService();
		}, interval);
	},
	
	_init: function() {
		this._refreshService();
	}.on('init')
});
