const Joi = require("joi");

const userSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string(),
	email: Joi.string().required(),
	password: Joi.string(),
	refreshToken: Joi.string(),
	resetToken: Joi.string(),
	resetTokenExpiry: Joi.date(),
	role: Joi.string().valid("Admin", "Default"),
});

const validateUser = (body) => {
	const { error } = userSchema.validate(body);
	return { error: error?.details[0]?.message || null };
};

module.exports = validateUser;
