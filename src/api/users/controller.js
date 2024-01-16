const userRepo = require("./repository");
const validateUser = require("./validate");

const createUser = async (req, res) => {
	try {
		// validate body
		const { error } = validateUser(req.body);
		if (error) {
			return res.status(400).json({ error });
		}

		// create user
		const user = await userRepo.create(req.body);
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUsers = async (req, res) => {
	try {
		// get all users
		const users = await userRepo.findAll(req.query);
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUserById = async (req, res) => {
	try {
		// get id
		const { id } = req.params;

		// get user by id
		const user = await userRepo.findById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateUserById = async (req, res) => {
	try {
		// get id
		const { id } = req.params;

		// get user by id
		const user = await userRepo.findById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// update user
		const updatedUser = await userRepo.updateById(id, req.body);
		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteUserById = async (req, res) => {
	try {
		// get id
		const { id } = req.params;

		// get user by id
		const user = await userRepo.findById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// remove user from db
		await userRepo.remove(id);
		res.json({ id });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createUser,
	getUsers,
	getUserById,
	updateUserById,
	deleteUserById,
};
