module.exports = (app) => {
	require("./user_account")(app);
	require("./user_recovery")(app);
	require("./user_registration")(app);
};
