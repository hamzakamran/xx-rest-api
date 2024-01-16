const sendOk = (_req, res) => {
	res.json({ ok: true });
};

module.exports = {
	sendOk,
};
