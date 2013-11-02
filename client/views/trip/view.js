Session.set('attractions', false);

Template.tripView.events({
    "click .deleteAttraction": function(event){
        event.preventDefault();
        Meteor.call('deleteAttraction', this._id);
    },
	'click #askFriendButton': function(event) {
        event.preventDefault();
		if ($('#friendEmailAddress').val() != "") {
			var url = "http://travel.meteor.com/trip/" + Session.get('slug');
	        Meteor.call('email', {url: url, email: $('#friendEmailAddress').val()});		
		}
	}
});

Template.potentialAttractionName.events({
    "click .addAttraction": function(event){
        event.preventDefault();

		$('#potentialAttractionLoading').fadeIn();

		if (Meteor.userId()) {
			Session.set('thisUserId',Meteor.userId())
			if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.name != '') {
				Session.set('thisUserName',Meteor.user().profile.name);
			}
		} else {
			Session.set('thisUserName', "Anonymous");	
		}
		
		var stopData = {
			tripid: 	Session.get('slug'),
			owner: 		Session.get('thisUserId'),
			author: 	Session.get('thisUserName'),
			name: 		event.srcElement.innerText,
			added: 		moment().format('MMMM Do YYYY, h:mm a')
		};
		
		Meteor.call('getReferenceDetails', event.srcElement.dataset.reference, "details", function(error, payload) {
			stopData.address = payload.data.address;
			stopData.phone = payload.data.phone;
			stopData.icon = payload.data.icon;
			stopData.photos = payload.data.photos;
			
			if (payload.data.url) 
				stopData.url = payload.data.url;
			
			if (payload.data.website) 
				stopData.website = payload.data.website;
			
			if (stopData.photos && stopData.photos[0] && stopData.photos[0]['photo_reference']) {
				var coverPhoto = stopData.photos[0]['photo_reference']
				Meteor.call('getReferenceDetails', coverPhoto, "photo", function(error, imgurl)
					{
						stopData.photo = imgurl.data;
						Attractions.insert(stopData);
						$('#addStopOnTripModal').modal('toggle');
						Session.set('attractions', false);						
				        Meteor.Router.to("/trip/"+Session.get('slug'));						
					});				
			} else {
				stopData.photo = false;
				Attractions.insert(stopData);				
				$('#addStopOnTripModal').modal('toggle');
				Session.set('attractions', false);				
		        Meteor.Router.to("/trip/"+Session.get('slug'));						
			}
		});
		
    }
});


Template.tripView.helpers({
    trip: function () {
        var tripsStream = Trips.findOne({slug: Session.get("slug")});
        Session.set("tripId", tripsStream._id);
        Session.set("tripCity", tripsStream.city);
        Session.set("tripCityLat", tripsStream.lat);
        Session.set("tripCityLng", tripsStream.lng);
        return tripsStream;
    },
    tripExists: function () {
        var tripsStreamCount = Trips.find({slug: Session.get("slug")}).count();
        if (tripsStreamCount) {
            return true;
        } else {
            return false;
        }
    },
    attractions: function() {
        return Attractions.find({tripid: Session.get("slug")});
    },
    attractionsExist: function () {
        var attractionsExistCount = Attractions.find({tripid: Session.get("slug")}).count();
        if (attractionsExistCount) {
            return true;
        } else {
            return false;
        }
    },
    isAdministrator: function() {
        if (Attractions.find({tripid: Session.get("slug")}).count() &&
			Attractions.findOne({tripid: Session.get("slug")}).owner == Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    }
});

Template.addStopOnThisTripModal.city = function() {
	return Session.get("tripCity");
}

Template.showPotentialAttractionsResults.potentialAttractionNames = function() {
	return Session.get('attractions');
}

Template.addStopOnThisTripModal.events({
    "keyup #potentialAttractionInput": function(event){
        event.preventDefault();
		var query = event.target.value;
		if (_.size(query) > 2) {
			Meteor.call('attractionQuery', query, Session.get('tripCityLat'), Session.get('tripCityLng'), function(error, attractionsNames) {
				if (error) {
					Session.set('attractions', false);
				} else {
					Session.set('attractions', attractionsNames.data);
				}
			})
		} else {
			Session.set('attractions', false);
		}
    }
});