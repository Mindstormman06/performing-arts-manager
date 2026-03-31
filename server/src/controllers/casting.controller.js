import castingService from "../services/casting.service.js";

async function getAll(req, res, next) {
	try {
		const data = await castingService.getShowCharacters(req.params.showId);
		res.json({ success: true, data });
	} catch (error) {
		next(error);
	}
}

async function getById(req, res, next) {
	try {
		const data = await castingService.getCharacterById(
			req.params.showId,
			req.params.characterId,
		);
		res.json({ success: true, data });
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function create(req, res, next) {
	try {
		const data = await castingService.createCharacter(req.params.showId, req.body);
		res.status(201).json({ success: true, data });
	} catch (error) {
		if (error.message.includes("required") || error.message.includes("member")) {
			return res.status(400).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function update(req, res, next) {
	try {
		const data = await castingService.updateCharacter(
			req.params.showId,
			req.params.characterId,
			req.body,
		);
		res.json({ success: true, data });
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		if (error.message.includes("required") || error.message.includes("member")) {
			return res.status(400).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function assign(req, res, next) {
	try {
		const data = await castingService.assignCharacter(
			req.params.showId,
			req.params.characterId,
			req.body?.users_id ?? null,
		);
		res.json({ success: true, data });
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		if (error.message.includes("member")) {
			return res.status(400).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function remove(req, res, next) {
	try {
		await castingService.deleteCharacter(req.params.showId, req.params.characterId);
		res.json({ success: true, message: "Character deleted" });
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

export default {
	getAll,
	getById,
	create,
	update,
	assign,
	remove,
};

