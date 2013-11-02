Template.loggedin_header.helpers({
    name: function() {
        var profile = Meteor.user().profile;
        return profile.name;
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
            return null;
        }
    },
    _id: function() {
        return Meteor.userId();
    }
});
