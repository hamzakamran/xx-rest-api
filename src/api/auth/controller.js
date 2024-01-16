const { sign, verify } = require("jsonwebtoken");
const userRepo = require("../users/repository");
const { hash, compare } = require("bcrypt");
const { User } = require("../users/model");

const cookieObject = {
	httpOnly: true,
	sameSite: "None",
	secure: true,
	maxAge: 15 * 24 * 60 * 60 * 1000,
};

const requestReset = async (req, res) => {
	try {
		// get email
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ error: `"email" is required.` });
		}

		// get user by email
		const user = await userRepo.findByEmail(email);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// create/set reset token with 24 hour expiration
		const resetToken = sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});
		user.resetToken = resetToken;
		user.resetTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
		await user.save;

		res.json({ resetToken });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		// get token and new password
		const { token, newPassword } = req.body;
		if (!token) {
			return res.status(400).json({ error: `"token" is required.` });
		}
		if (!newPassword) {
			return res
				.status(400)
				.json({ error: `"newPassword" is required.` });
		}

		// verify token isn't expired
		const { email, exp } = verify(token, process.env.JWT_SECRET, {});
		if (new Date() > new Date(exp * 1000)) {
			return res.status(400).json({ error: "Token has expired." });
		}

		// get user by email
		const user = await userRepo.findByEmail(email);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// hash new password
		const hashedPassword = await hash(newPassword, 10);

		// check if password is same as previous password
		if (user.password) {
			const match = await compare(newPassword, user.password);
			if (match) {
				return res.status(400).json({
					error: "New password canont equal previous password.",
				});
			}
		}

		// set new password
		user.password = hashedPassword;
		user.resetToken = null;
		user.resetTokenExpiry = null;
		await user.save();

		res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const handleLogin = async (req, res) => {
	try {
		// validate req.body
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ error: `"email" and "password" are required.` });
		}

		// get user by email
		const user = await userRepo.findByEmail(email);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// check if passwords match
		const match = await compare(password, user.password);
		if (!match) {
			return res.status(400).json({ error: "Unable to login." });
		}

		// create access/refresh tokens
		const payload = {
			_id: user._id,
			email: user.email,
		};
		const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "15d",
		});
		const refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: "15d",
		});

		// save refresh token for user
		await userRepo.updateById(user._id, {
			refreshToken,
		});

		// send jwt cookie and access token
		res.cookie("jwt", refreshToken, cookieObject);
		res.json({ ...payload, accessToken });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const handleRefreshToken = async (req, res) => {
	try {
		// get jwt cookie
		const cookies = req.cookies;
		if (!cookies.jwt) {
			return res.status(401).json({ error: "Token not found." });
		}
		const refreshToken = cookies.jwt;

		// get user by refresh token
		const user = await User.findOne({ refreshToken });
		if (!user) {
			return res.status(403).json({ error: "User not found." });
		}

		// verify token
		verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			(err, decoded) => {
				if (err || user.email !== decoded.email) {
					return res.status(403).json({ error: "User not found." });
				}
				const accessToken = sign(
					{
						email: decoded.email,
						expirationDate: decoded.expirationDate,
					},
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: "15d" }
				);
				res.json(accessToken);
			}
		);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const handleLogout = async (req, res) => {
	try {
		// get jwt cookie
		const cookies = req.cookies;
		if (!cookies.jwt) {
			return res.status(204);
		}
		const refreshToken = cookies.jwt;

		// get user by refresh token
		const user = await User.findOne({ refreshToken });
		if (!user) {
			res.clearCookie("jwt", cookieObject);
			return res.sendStatus(204);
		}

		// clear refresh token
		user.refreshToken = "";
		await user.save();

		// clear cookie
		res.clearCookie("jwt", cookieObject);
		res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	requestReset,
	resetPassword,
	handleLogin,
	handleRefreshToken,
	handleLogout,
};
