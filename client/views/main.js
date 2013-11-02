Meteor.subscribe("Attractions");
Meteor.subscribe("TripsStream");
Meteor.subscribe("Trips");

if (Meteor.is_client) {
    Meteor.startup(function () {

    });
}