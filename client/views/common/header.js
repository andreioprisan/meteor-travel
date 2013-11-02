Template.loggedin_header.helpers({
    name: function() {
        var profile = Meteor.user().profile;
		if (profile && profile.name) {
	        return profile.name;			
		} else {
			return Meteor.user().emails[0].address;
		}
    },

    id: function() {
        return Meteor.userId();
    }

});

Template.header.helpers({
    name: function() {
        if (Meteor.userId()) {
            var profile = Meteor.user().profile;
            return profile.name;
        } else {
			return Meteor.user().emails[0].address;
        }
    },
    _id: function() {
        return Meteor.userId();
    }
});
