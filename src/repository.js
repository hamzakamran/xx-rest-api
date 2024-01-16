class Repository {
	constructor(model) {
		this.model = model;
	}

	async create(newDoc) {
		return this.model.create(newDoc);
	}

	async findAll(query) {
		return this.model.find(query);
	}

	async findById(id) {
		return this.model.findById(id);
	}

	async findByEmail(email) {
		return this.model.findOne({ email });
	}

	async findByRefreshToken(refreshToken) {
		return this.model.findOne({ refreshToken });
	}

	async updateById(id, updatedDoc) {
		return this.model.findByIdAndUpdate(id, updatedDoc, { new: true });
	}

	async remove(id) {
		return this.model.findOneAndDelete({ _id: id });
	}
}

module.exports = Repository;
