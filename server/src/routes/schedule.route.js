/**
 * Express router for organization and show calendars, mounted at
 * `/api/schedule`.
 *
 * @remarks
 * Every route requires a logged-in user, and `GET /personal` returns the
 * caller's own events. Reading a calendar requires active org or show
 * membership. Creating, editing, deleting and assigning people to org events
 * requires the `president` or `board-member` role; for show events it requires
 * `director` or `stage-manager`, or org oversight.
 */

import Router from "express";

import scheduleController from "../controllers/schedule.controller.js";
import {
	authenticate,
	authorizeOrg,
	authorizeShow,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
	"/orgs/:orgId",
	authenticate,
	authorizeOrg(),
	scheduleController.getOrgCalendar,
);

router.get(
	"/shows/:showId",
	authenticate,
	authorizeShow(),
	scheduleController.getShowCalendar,
);

router.post(
	"/orgs/:orgId",
	authenticate,
	authorizeOrg(["president", "board-member"]),
	scheduleController.createOrgEvent,
);

router.post(
	"/shows/:showId",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	scheduleController.createShowEvent,
);

router.put(
	"/orgs/:orgId/:eventId",
	authenticate,
	authorizeOrg(["president", "board-member"]),
	scheduleController.updateEvent,
);

router.put(
	"/shows/:showId/:eventId",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	scheduleController.updateEvent,
);

router.delete(
	"/orgs/:orgId/:eventId",
	authenticate,
	authorizeOrg(["president", "board-member"]),
	scheduleController.deleteEvent,
);

router.delete(
	"/shows/:showId/:eventId",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	scheduleController.deleteEvent,
);

router.post(
	"/orgs/:orgId/:eventId/users",
	authenticate,
	authorizeOrg(["president", "board-member"]),
	scheduleController.assignOrgEventUsers,
);

router.post(
	"/shows/:showId/:eventId/users",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	scheduleController.assignShowEventUsers,
);

router.put(
	"/orgs/:orgId/:eventId/users",
	authenticate,
	authorizeOrg(["president", "board-member"]),
	scheduleController.assignOrgEventUsers,
);

router.put(
	"/shows/:showId/:eventId/users",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	scheduleController.assignShowEventUsers,
);

router.get("/personal", authenticate, scheduleController.getPersonalSchedule);

export default router;
