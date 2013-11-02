Accounts.urls.resetPassword = function (token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.urls.enrollAccount = function (token) {
  return Meteor.absoluteUrl('enroll-account/' + token);
};

Accounts.config({sendVerificationEmail: false, forbidClientAccountCreation: false});

Accounts.onCreateUser(function (options, user) {
	user.profile = options.profile;
//	Accounts.sendVerificationEmail(user._id, user.emails[0].address);
	return user;
});

