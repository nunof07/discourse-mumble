export default Ember.Component.extend({
	tagName: '',
	data: null,
	
	idle: function() {
		var data = this.get('data');
		
		if (data && data.idlesecs) {
			return (parseInt(data.idlesecs) > 0);
		}
		
		return false;
	}.property('data')
});
