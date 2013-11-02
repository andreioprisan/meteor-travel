// for robots
Meteor.Router.add('/robots.txt', 'GET', function(id) {
  return [200, 'User-agent: *'];
});

Meteor.methods({
	// using the heuristic hermes crawler
	placeQuery: function (query) {
		var Future = Npm.require('fibers/future');
		var fut = new Future();
		
		var placesAPIurl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?sensor=false&key=AIzaSyD4LaqZwil8CjnS27genYjrRdSDCGRWEGI&input='+query+'&types=(cities)&language=en_US';
		
		HTTP.get(placesAPIurl,
		function (error,data) { 
			if (!error && data && data.data.predictions) {
				var citiesList = [];
				_.each(data.data.predictions, function(element) {
					citiesList.push({id: element.id, name: element.description, reference: element.reference});
				});
				console.log(citiesList);
				
				fut['return']({'statusCode':data.statusCode, 'data': citiesList});				
			} else {
				fut['return']({'statusCode':'500', 'data': {}})
			}
		});
		
		return fut.wait();
	},
	getReferenceDetails: function(reference, type) {
		var Future = Npm.require('fibers/future');
		var fut = new Future();
		
		var placesAPIurl = 'https://maps.googleapis.com/maps/api/place/details/json?reference='+reference+'&sensor=false&key=AIzaSyD4LaqZwil8CjnS27genYjrRdSDCGRWEGI';
		
		if (type == "photo") {
			placesAPIurl = 'maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference='+reference+'&sensor=true&key=AIzaSyD4LaqZwil8CjnS27genYjrRdSDCGRWEGI';
			fut['return']({'statusCode':'200', 'data': placesAPIurl});
		} else {
			HTTP.get(placesAPIurl,
			function (error,data) { 
			
				if (!error && data && data.data) {
					var payload = {};
				
					if (type == "coordinates") {
						payload.lat = data.data.result.geometry.location.lat, 
						payload.lng = data.data.result.geometry.location.lng,
						payload.map = data.data.result.url
					} else if (type == "details") {
						payload.address = data.data.result.formatted_address;
						payload.phone = data.data.result.formatted_phone_number;
						payload.icon = data.data.result.icon;
						payload.photos = data.data.result.photos;
					
						if (data.data.result.url) 
							payload.url = data.data.result.url;
						
						if (data.data.result.website) 
							payload.website = data.data.result.website;
					}
				
					fut['return']({'statusCode':data.statusCode, 'data': payload});				
				} else {
					fut['return']({'statusCode':'500', 'data': {}})
				}
			});
		}
		
		return fut.wait();
	},
	attractionQuery: function(query, lat, lng) {
		var Future = Npm.require('fibers/future');
		var fut = new Future();
		
		var placesAPIurl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+query+'&types=establishment&location='+lat+','+lng+'&radius=100&sensor=true&key=AIzaSyD4LaqZwil8CjnS27genYjrRdSDCGRWEGI';
		HTTP.get(placesAPIurl,
		function (error,data) { 
			if (!error && data && data.data.predictions) {
				var attractionsList = [];
				_.each(data.data.predictions, function(element) {
					attractionsList.push({id: element.id, name: element.description, reference: element.reference});
				});
				fut['return']({'statusCode':data.statusCode, 'data': attractionsList});				
			} else {
				fut['return']({'statusCode':'500', 'data': {}})
			}
		});
		
		return fut.wait();
		
	},
	deleteAttraction: function (id) {
        Attractions.remove(id);
	},
	deleteTrip: function (id) {
        Trip.remove(id);
	},
});