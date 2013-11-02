Meteor.methods({
	email: function (data) {
	    this.unblock();
	    if (data.email != undefined) {
			var emailPayload = {
				to: data.email,
			    subject: 'Invitation from Meteor Travel!',
			    text: 	'Hi!\n\n'+
			    		"Your buddy asked you for a recommendation for their upcoming trip at "+data.url+"!\n\n"+
			    		"Thanks,\nThe Meteor Travel Team"
			    }

			if (emailPayload.to != undefined &&
				emailPayload.subject != undefined &&
				emailPayload.text != undefined) {
				Email.send({
			      to: emailPayload.to,
			      from: "Meteor Travel Team <andrei@oprisan.com>",
			      subject: emailPayload.subject,
			      text: emailPayload.text
			    });
			}
	    }
	}
});
