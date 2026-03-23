import scheduleService from "../services/schedule.service.js"

async function getOrgCalendar(req, res, next) {
    try {
        const orgId = req.params.orgId;
        const calendar = await scheduleService.getOrgCalendar(orgId);
        res.json({ success: true, data: calendar });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function getShowCalendar(req, res, next) {
    try {
        const showId = req.params.showId;
        const calendar = await scheduleService.getShowCalendar(showId);
        res.json({ success: true, data: calendar });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function createOrgEvent(req, res, next) {
    try {
        const orgId = req.params.orgId;
        const creatorId = req.user.id;
        const event = await scheduleService.createOrgEvent(orgId, creatorId, req.body);
        res.status(201).json({ success: true, data: event});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function createShowEvent(req, res, next) {
    try {
        const showId = req.params.showId;
        const creatorId = req.user.id;
        const event = await scheduleService.createShowEvent(showId, creatorId, req.body);
        res.status(201).json({ success: true, data: event});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function updateEvent(req, res, next) {
    try {
        const eventId = req.params.eventId;
        const event = await scheduleService.updateEvent(eventId, req.body);
        res.json({ success: true, data: event });
    } catch (error) {
        if (error.message === "Event not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error(error);
        next(error);
    }
}

async function deleteEvent(req, res, next) {
    try {
        const eventId = req.params.eventId;
        const result = await scheduleService.deleteEvent(eventId);
        res.json({ success: true, message: result.message });
    } catch (error) {
        if (error.message === "Event not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error(error);
        next(error);
    }
}

async function assignShowEventUsers(req, res, next) {
    try {
        const { showId, eventId } = req.params;
        const assignedUsers = await scheduleService.assignUsersToShowEvent(showId, eventId, req.body);
        res.json({ success: true, data: assignedUsers });
    } catch (error) {
        if (error.message === "Event not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error(error);
        next(error);
    }
}

async function assignOrgEventUsers(req, res, next) {
    try {
        const { orgId, eventId } = req.params;
        const assignedUsers = await scheduleService.assignUsersToOrgEvent(orgId, eventId, req.body);
        res.json({ success: true, data: assignedUsers });
    } catch (error) {
        if (error.message === "Event not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error(error);
        next(error);
    }
}

async function getPersonalSchedule(req, res, next) {
    try {
        const userId = req.user.id;
        const schedule = await scheduleService.getPersonalSchedule(userId);
        res.json({ success: true, data: schedule });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export default { getOrgCalendar, getShowCalendar, createOrgEvent, createShowEvent, updateEvent, deleteEvent, assignShowEventUsers, assignOrgEventUsers, getPersonalSchedule };