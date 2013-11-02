Meteor.Router.add({
    '/': function() {
        Session.set("current_page", 'home');
        return 'home';
    },
    '/page/:page': function(page) {
        Session.set("current_page", page);
        return page;
    },
    '/logout': function() {
        Meteor.logout(function(error) {
            if(error) {
                alert("Could not logout!")
            } else {
				Session.set('thisUserName','Anonymous User')
				Session.set('thisUserId',false)				
                Meteor.Router.to("/");        
            }

        });
    },
    '/dashboard': function(id) {
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'dashboard');
        return 'dashboard';
    },
    '/users/:id': function(id) {
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'dashboard');
        return 'dashboard';
    },
    '/users/:id/edit': function(id) {
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'editProfile');
        return 'editProfile';
    },
    '/trip/create': function(id) {
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'tripCreate');
        return 'eventCreate';
    },
    '/trip/public': function(id) {
        Session.set("current_page", 'publicTrips');
        return 'publicTrips';
    },
    '/trip/list': function(id) {
        Session.set("current_page", 'tripList');
        return 'tripList';
    },
    '/trip/:id': function(id) {
        Session.set("slug", id);
        Session.set("current_page", 'tripView');
		
        return 'tripView';
    }  
});
