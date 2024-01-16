const {
	requestReset,
	resetPassword,
	handleLogin,
	handleRefreshToken,
	handleLogout,
} = require("./controller");

const router = require("express").Router();

router.post("/request-reset", requestReset);
router.post("/reset-password", resetPassword);
router.post("/login", handleLogin);
router.post("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
