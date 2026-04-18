import { afterEach, describe, expect, it, vi } from "vitest";

import castingController from "../../src/controllers/casting.controller.js";
import castingService from "../../src/services/casting.service.js";

describe("Casting Controller - Direct Tests", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("getAll returns data on success", async () => {
		const data = [{ id: 1, name: "Hamlet" }];
		vi.spyOn(castingService, "getShowCharacters").mockResolvedValue(data);
		const res = { json: vi.fn() };
		const next = vi.fn();

		await castingController.getAll({ params: { showId: 2 } }, res, next);

		expect(res.json).toHaveBeenCalledWith({ success: true, data });
		expect(next).not.toHaveBeenCalled();
	});

	it("getAll forwards generic errors", async () => {
		const error = new Error("db down");
		vi.spyOn(castingService, "getShowCharacters").mockRejectedValue(error);
		const next = vi.fn();

		await castingController.getAll({ params: { showId: 2 } }, {}, next);

		expect(next).toHaveBeenCalledWith(error);
	});

	it("getById returns 404 for not found errors", async () => {
		vi.spyOn(castingService, "getCharacterById").mockRejectedValue(
			new Error("Character not found"),
		);
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
		const next = vi.fn();

		await castingController.getById(
			{ params: { showId: 1, characterId: 9 } },
			res,
			next,
		);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(next).not.toHaveBeenCalled();
	});

	it("getById forwards non-not-found errors", async () => {
		const error = new Error("query exploded");
		vi.spyOn(castingService, "getCharacterById").mockRejectedValue(error);
		const next = vi.fn();

		await castingController.getById(
			{ params: { showId: 1, characterId: 9 } },
			{},
			next,
		);

		expect(next).toHaveBeenCalledWith(error);
	});

	it("create returns 201 on success", async () => {
		const data = { id: 3, name: "Ophelia" };
		vi.spyOn(castingService, "createCharacter").mockResolvedValue(data);
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
		const next = vi.fn();

		await castingController.create(
			{ params: { showId: 1 }, body: { name: "Ophelia" } },
			res,
			next,
		);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ success: true, data });
		expect(next).not.toHaveBeenCalled();
	});

	it("create returns 400 for required validation errors", async () => {
		vi.spyOn(castingService, "createCharacter").mockRejectedValue(
			new Error("name is required"),
		);
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
		const next = vi.fn();

		await castingController.create(
			{ params: { showId: 1 }, body: {} },
			res,
			next,
		);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("create returns 400 for member validation errors", async () => {
		vi.spyOn(castingService, "createCharacter").mockRejectedValue(
			new Error("Assigned user must be a member of the show"),
		);
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
		const next = vi.fn();

		await castingController.create(
			{ params: { showId: 1 }, body: { users_id: 2 } },
			res,
			next,
		);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("update handles not found, bad request, and generic errors", async () => {
		const req = { params: { showId: 1, characterId: 2 }, body: {} };
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
		const next = vi.fn();
		const spy = vi.spyOn(castingService, "updateCharacter");

		spy.mockRejectedValueOnce(new Error("Character not found"));
		await castingController.update(req, res, next);
		expect(res.status).toHaveBeenLastCalledWith(404);

		spy.mockRejectedValueOnce(new Error("member required"));
		await castingController.update(req, res, next);
		expect(res.status).toHaveBeenLastCalledWith(400);

		const generic = new Error("unknown");
		spy.mockRejectedValueOnce(generic);
		await castingController.update(req, res, next);
		expect(next).toHaveBeenCalledWith(generic);
	});

	it("assign handles not found, member validation, and generic errors", async () => {
		const req = {
			params: { showId: 1, characterId: 2 },
			body: { users_id: 8 },
		};
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
		const next = vi.fn();
		const spy = vi.spyOn(castingService, "assignCharacter");

		spy.mockRejectedValueOnce(new Error("Character not found"));
		await castingController.assign(req, res, next);
		expect(res.status).toHaveBeenLastCalledWith(404);

		spy.mockRejectedValueOnce(new Error("User is not a member"));
		await castingController.assign(req, res, next);
		expect(res.status).toHaveBeenLastCalledWith(400);

		const generic = new Error("unexpected");
		spy.mockRejectedValueOnce(generic);
		await castingController.assign(req, res, next);
		expect(next).toHaveBeenCalledWith(generic);
	});

	it("remove returns 404 for missing character and forwards generic errors", async () => {
		const req = { params: { showId: 1, characterId: 2 } };
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
		const next = vi.fn();
		const spy = vi.spyOn(castingService, "deleteCharacter");

		spy.mockRejectedValueOnce(new Error("Character not found"));
		await castingController.remove(req, res, next);
		expect(res.status).toHaveBeenLastCalledWith(404);

		const generic = new Error("boom");
		spy.mockRejectedValueOnce(generic);
		await castingController.remove(req, res, next);
		expect(next).toHaveBeenCalledWith(generic);
	});

	it("remove returns success when deletion succeeds", async () => {
		vi.spyOn(castingService, "deleteCharacter").mockResolvedValue(undefined);
		const res = { json: vi.fn() };
		const next = vi.fn();

		await castingController.remove(
			{ params: { showId: 1, characterId: 2 } },
			res,
			next,
		);

		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: "Character deleted",
		});
		expect(next).not.toHaveBeenCalled();
	});
});
