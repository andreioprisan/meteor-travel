// for robots
Meteor.Router.add('/robots.txt', 'GET', function(id) {
  return [200, 'User-agent: *'];
});

function getRandAPIKey() {
	var keys = [
	'AIzaSyAKz0xVy5b3xR-kANO5qH3b0fXh3m9on_g',
	'AIzaSyDChWB99WaMRq9TvHfm3FUPVADrwHuDQtA',
	'AIzaSyBmBhRPQ8HUY7cR_BPGtat_AhZe4r8gfD8',
	'AIzaSyC5JhQy6R7QgEQtsw-LZmXhm7m7Jp8JQT8',
	'AIzaSyAr61gcWLpKxX5jQGhWD0sHNqi_db49_m4',
	'AIzaSyB8LOfaw111sj3dr5PAK4vqJI3o2dmyzXk',
	'AIzaSyBbOSy2y0VgscEQMonxzt2utjDLl6xodmc',
	'AIzaSyAS44zcAr4hthU3UWsufomcy6bXOLwaMGo',
	'AIzaSyA8QHeUe7yZAZbePNGla3o9eS29EIFU0T4',
	'AIzaSyDFFplTk3Jh0JTQ0gHn47NkoySgZRYk5Rs'
	];
	return Random.choice(keys);
}

Meteor.methods({
	// using the heuristic hermes crawler
	placeQuery: function (query) {
		var Future = Npm.require('fibers/future');
		var fut = new Future();
		
		var placesAPIurl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?sensor=false&key='+getRandAPIKey()+'&input='+query+'&types=(cities)&language=en_US';
		
		HTTP.get(placesAPIurl,
		function (error,data) { 
			if (!error && data && data.data.predictions) {
				var citiesList = [];
				_.each(data.data.predictions, function(element) {
					citiesList.push({id: element.id, name: element.description, reference: element.reference});
				});
				
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
		
		var placesAPIurl = 'https://maps.googleapis.com/maps/api/place/details/json?reference='+reference+'&sensor=false&key='+getRandAPIKey()+'';
		
		if (type == "photo") {
			placesAPIurl = 'maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference='+reference+'&sensor=true&key='+getRandAPIKey()+'';
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
		
		var placesAPIurl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+query+'&types=establishment&location='+lat+','+lng+'&radius=100&sensor=true&key='+getRandAPIKey()+'';
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
        Trips.remove(id);
	},
});
