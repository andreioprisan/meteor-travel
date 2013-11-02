Template.editProfile.name = function() {
    var name = null;
	if (Meteor.user().profile &&  Meteor.user().profile.name) {
        name = profile.name;			
	} else {
		name = Meteor.user().emails[0].address;
	}
	return name;
};
