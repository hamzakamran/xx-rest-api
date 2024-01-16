const verifyJwt = require("../../middleware/verifyJwt");
const {
	createUser,
	getUsers,
	getUserById,
	updateUserById,
	deleteUserById,
} = require("./controller");

const router = require("express").Router();

// unprotected routes
router.post("/", createUser);

// auth-protected routes
router.use(verifyJwt);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
