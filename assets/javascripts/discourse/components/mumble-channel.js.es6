export default Ember.Component.extend({
	tagName: '',
	data: null,
	expanded: true,
	
	children: function () {
		return Mumble.getChannels(this.get('data'));
	}.property('data'),
	
	usersList: function () {
		return Mumble.getUsers(this.get('data'));
	}.property('data'),
	
	userCount: function () {
		return Mumble.countUsers(this.get('data'), true);
	}.property('data'),
	
	isVisible: function () {
		var isEmpty = (this.get('userCount') === 0);
		
		return (!isEmpty || Discourse.SiteSettings.mumble_show_empty_channels);
	}.property('isEmpty'),
	
	iconClass: function () {
		return this.get('expanded')
			? "fa fa-caret-down"
			: "fa fa-caret-right";
	}.property('expanded'),
	
	actions: {
		expand: function () {
			this.set('expanded', !this.get('expanded'));
		}
	}
});
