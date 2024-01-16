const { Schema, model } = require("mongoose");

const userSchema = Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: String,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: String,
		refreshToken: String,
		resetToken: String,
		resetTokenExpiry: Date,
		role: {
			type: String,
			enum: ["Admin", "Default"],
			default: "Default",
		},
	},
	{
		timestamps: true,
	}
);

const User = model("User", userSchema);

module.exports = {
	userSchema,
	User,
};
