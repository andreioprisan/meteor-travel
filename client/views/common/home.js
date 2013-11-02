Session.set('placesNames',false)
Session.set('attractions', false);						
Session.set('newTripId',Random.hexString(32));
Session.set('tripPrivate',false)
Session.set('tripAnonymous',true)
Session.set('tripCity',false)
Session.set('tripCityLat',false)
Session.set('tripCityLng',false)
Session.set('tripCityId',false)
Session.set('thisUserName','Anonymous User')
Session.set('thisUserId',false)

Template.home.events({
    "keyup #placeSearch": function(event){
        event.preventDefault();
		var query = event.target.value;
		if (_.size(query) > 2) {
			Meteor.call('placeQuery', query, function(error, placesNames) {
				if (error) {
					Session.set('placesNames', false);
				} else {
					Session.set('placesNames', placesNames.data);
				}
			})
		} else {
			Session.set('placesNames',false)			
		}
    }
});

Template.home.placeNames = function() {
	return Session.get('placesNames');
}

Template.home.events({
    "click .placeCity": function(event){
		$('#cityLoading').fadeIn();
		
		Session.set('tripCityId',event.target.id);
		Session.set('tripCity',event.srcElement.innerText);
		Session.set('tripCityRef',event.srcElement.dataset.reference);
		if (Meteor.userId()) {
			Session.set('thisUserId',Meteor.userId())
		    var name = null;
			if (Meteor.user().profile &&  Meteor.user().profile.name) {
		        name = Meteor.user().profile.name;			
			} else {
				name = Meteor.user().emails[0].address;
			}

			Session.set('thisUserName', name);
			Session.set('tripAnonymous',false)				
		}
		
		var tripData = {
			private: 	Session.get('tripPrivate'),
			anonymous: 	Session.get('tripAnonymous'),
			owner: 		Session.get('thisUserId'),
			author: 	Session.get('thisUserName'),
			city: 		Session.get('tripCity'),
			cityId: 	Session.get('tripCityId'),
			cityRef: 	Session.get('tripCityRef'),
			slug: 		Session.get('newTripId'),
			created: 	moment().format('MMMM Do YYYY, h:mm a')
		};
		
		Meteor.call('getReferenceDetails', event.srcElement.dataset.reference, "coordinates", function(error, payload) {
			tripData.lat = payload.data.lat;
			tripData.lng = payload.data.lng;
			tripData.map = payload.data.map;
			Session.set('tripCityLat',tripData.lat)
			Session.set('tripCityLng',tripData.lng)
			
			Trips.insert(tripData);
			Session.set('placesNames', false);
			
	        Meteor.Router.to("/trip/"+Session.get('newTripId'));
		});
	}
});