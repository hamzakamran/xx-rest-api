const Repository = require("../../repository");
const { User } = require("./model");

const userRepo = new Repository(User);

module.exports = userRepo;
