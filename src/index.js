const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");
const verifyJwt = require("./middleware/verifyJwt");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express(); // create express app
connectDb(); // connect to database

// app middleware
app.use(express.json());
app.use(cookieParser());

// unprotected routes
app.use("/health", require("./api/health"));
app.use("/auth", require("./api/auth"));
app.use("/users", require("./api/users"));

// auth-protected routes
app.use(verifyJwt);

// error handling middleware
app.use((err, _req, res, _next) => {
	res.status(500).json({ error: "Internal Server Error", details: err });
});

app.listen(PORT, (err) => {
	if (!err) {
		console.log(`Server running on port ${PORT}`);
	} else {
		console.log(`Error occured: ${err}`);
	}
});
