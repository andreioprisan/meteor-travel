Accounts.config({sendVerificationEmail: false, forbidClientAccountCreation: false});

Accounts.onCreateUser(function (options, user) {
	user.profile = options.profile;
	return user;
});

