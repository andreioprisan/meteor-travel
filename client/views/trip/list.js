Template.tripList.user = function() {
    return Meteor.user();
};

Template.tripList.events({
    "click .deleteTrip": function(event){
        event.preventDefault();    
        Meteor.call('deleteTrip', this._id, function(error, res) {
        });
    },
});

Template.tripList.helpers({
    tripNames: function () {
        if (Meteor.user() != undefined)
            return Trips.find({owner: Meteor.userId()});
        else
            return null;
    },
    hasTripsList: function () {
        if (Meteor.user() != undefined)
            return Trips.find({owner: Meteor.userId()}).count() > 0;
        else
            return null;
    }
});