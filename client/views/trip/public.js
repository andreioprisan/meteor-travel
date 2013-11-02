Template.publicTrips.helpers({
    trips: function () {
        return Trips.find({private: false});
    },
});