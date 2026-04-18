import bcrypt from "bcryptjs";

import { seedUsers } from "./seed-users.local.js";
import models from "./src/models/index.js";
import sequelize from "./src/services/db.service.js";

const { usersData, showProfileDataByUserId } = seedUsers;

async function seed() {
	try {
		console.log("🔄 Wiping database and syncing tables...");
		await sequelize.sync({ force: true }); // Wipes and recreates tables based on models

		const now = new Date();
		const inTwoWeeks = new Date();
		inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
		const inOneMonth = new Date();
		inOneMonth.setMonth(inOneMonth.getMonth() + 1);
		const inTwoMonths = new Date();
		inTwoMonths.setMonth(inTwoMonths.getMonth() + 2);

		// ------------------------
		// 1. Roles & Departments
		// ------------------------
		console.log("🌱 Seeding Roles & Departments...");

		await models.OrganizationRole.bulkCreate([
			{ id: 1, name: "president" },
			{ id: 2, name: "board-member" },
			{ id: 3, name: "general" },
			{ id: 4, name: "costumes" },
			{ id: 5, name: "props" },
			{ id: 6, name: "sets" },
			{ id: 7, name: "tech" },
		]);

		await models.ShowRole.bulkCreate([
			{ id: 100, name: "director" },
			{ id: 101, name: "co-director" },
			{ id: 102, name: "stage-manager" },
			{ id: 103, name: "actor" },
			{ id: 104, name: "choreographer" },
			{ id: 105, name: "dance-captain" },
			{ id: 106, name: "sound-design" },
			{ id: 107, name: "lighting-design" },
			{ id: 108, name: "costumes" },
			{ id: 109, name: "props" },
			{ id: 110, name: "sets" },
			{ id: 111, name: "tech" },
			{ id: 112, name: "photographer" },
			{ id: 113, name: "producer" },
			{ id: 114, name: "makeup" },
			{ id: 115, name: "crew" },
		]);

		await models.Department.bulkCreate([
			{ id: 1, name: "Lighting" },
			{ id: 2, name: "Sound" },
			{ id: 3, name: "Costumes" },
			{ id: 4, name: "Props" },
			{ id: 5, name: "Scenic" },
			{ id: 6, name: "Front of House" },
		]);

		// ------------------------
		// 2. Users from CSV
		// ------------------------
		console.log("👥 Seeding Users from CSV...");
		const passwordHash = await bcrypt.hash("password123", 10);
		const usersWithPasswordHash = usersData.map((user) => ({
			...user,
			passwordHash,
		}));
		await models.User.bulkCreate(usersWithPasswordHash);

		// ------------------------
		// 3. Organization & Memberships
		// ------------------------
		console.log("🏢 Seeding Organizations & Memberships...");
		const org = await models.Organization.create({
			id: 1,
			name: "Shawnigan Players",
		});

		// Add all users to the organization
		const orgMembershipsData = usersData.map((u) => ({
			users_id: u.id,
			org_id: org.id,
			status: "active",
		}));
		const orgMemberships = await models.OrgMembership.bulkCreate(
			orgMembershipsData,
			{ returning: true },
		);

		// Assign organization roles
		await models.OrgRoleRelationship.bulkCreate([
			{
				assignment_id: orgMemberships.find((m) => m.users_id === 4)
					.assignment_id,
				role_id: 1,
			}, // Bill: President
			{
				assignment_id: orgMemberships.find((m) => m.users_id === 3)
					.assignment_id,
				role_id: 2,
			}, // Joshua: Board Member
			{
				assignment_id: orgMemberships.find((m) => m.users_id === 6)
					.assignment_id,
				role_id: 2,
			}, // Cathy: Board Member
			{
				assignment_id: orgMemberships.find((m) => m.users_id === 9)
					.assignment_id,
				role_id: 2,
			}, // Alex: Board Member
			{
				assignment_id: orgMemberships.find((m) => m.users_id === 5)
					.assignment_id,
				role_id: 2,
			}, // Aiden: Board Member
			{
				assignment_id: orgMemberships.find((m) => m.users_id === 7)
					.assignment_id,
				role_id: 2,
			}, // Lily: Board Member
		]);

		// ------------------------
		// 4. Shows & Show Memberships
		// ------------------------
		console.log("🎭 Seeding Shows & Cast/Crew...");
		await models.Show.bulkCreate([
			{
				id: 1,
				title: "Santa in Space",
				start_date: now,
				end_date: inOneMonth,
				organization_id: org.id,
			},
			{
				id: 2,
				title: "The Tales of Conall Cra Bhuidhe",
				start_date: inOneMonth,
				end_date: inTwoMonths,
				organization_id: org.id,
			},
		]);

		// Map user IDs to show memberships for Santa in Space (all except SP-only cast)
		const santaMembersData = [
			{ users_id: 1, show_id: 1, status: "active" }, // Laura: Director
			{ users_id: 2, show_id: 1, status: "active" }, // Jade: Co-Director
			{ users_id: 4, show_id: 1, status: "active" }, // Bill: Producer
			{ users_id: 5, show_id: 1, status: "active" }, // Aiden: Stage Manager
			{ users_id: 6, show_id: 1, status: "active" }, // Cathy: Choreographer
			{ users_id: 7, show_id: 1, status: "active" }, // Lily: Dance Captain
			{ users_id: 8, show_id: 1, status: "active" }, // Raine: Sound Design
			{ users_id: 9, show_id: 1, status: "active" }, // Alex: Vileun
			{ users_id: 10, show_id: 1, status: "active" }, // Dan: Dame Dangle
			{ users_id: 11, show_id: 1, status: "active" }, // Bowie: Null
			{ users_id: 12, show_id: 1, status: "active" }, // Nora: Little Tommy
			{ users_id: 13, show_id: 1, status: "active" }, // Jasmine: Roberta
			{ users_id: 14, show_id: 1, status: "active" }, // Rob: Santa
			{ users_id: 15, show_id: 1, status: "active" }, // Lara: Dancing Doll
			{ users_id: 16, show_id: 1, status: "active" }, // Arwen: Crystal
			{ users_id: 17, show_id: 1, status: "active" }, // Sarah: 1st Girl
			{ users_id: 18, show_id: 1, status: "active" }, // Aaron: Prince Paragon
			{ users_id: 19, show_id: 1, status: "active" }, // Phillip: Monster
			{ users_id: 20, show_id: 1, status: "active" }, // Jessie: 1st Varborite
			{ users_id: 21, show_id: 1, status: "active" }, // Jordan: Villager
			{ users_id: 22, show_id: 1, status: "active" }, // Kael: Monster
			{ users_id: 23, show_id: 1, status: "active" }, // Cameron: Villager
			{ users_id: 24, show_id: 1, status: "active" }, // William: Monster
			{ users_id: 25, show_id: 1, status: "active" }, // Max: Kid
			{ users_id: 26, show_id: 1, status: "active" }, // Ruby: Kid
			{ users_id: 27, show_id: 1, status: "active" }, // Tamalane: Villager
			{ users_id: 28, show_id: 1, status: "active" }, // Elys: Kid
			{ users_id: 29, show_id: 1, status: "active" }, // Roland: Crew
			{ users_id: 30, show_id: 1, status: "active" }, // Kahlan: Stage Crew
			{ users_id: 31, show_id: 1, status: "active" }, // Bekah: Stage Crew
			{ users_id: 32, show_id: 1, status: "active" }, // Ward: Stage Crew
			{ users_id: 33, show_id: 1, status: "active" }, // Maia: Makeup
			{ users_id: 34, show_id: 1, status: "active" }, // Kendra: Makeup
			{ users_id: 35, show_id: 1, status: "active" }, // Joel: Backup Crew
		];
		const santaMembersWithPhotos = santaMembersData.map((member) => ({
			...member,
			bio: showProfileDataByUserId[member.users_id]?.bio ?? null,
			photo_path: showProfileDataByUserId[member.users_id]?.photo_path ?? null,
		}));
		const santaMembers = await models.ShowMembership.bulkCreate(
			santaMembersWithPhotos,
			{ returning: true },
		);

		// Map user IDs to show memberships for Scottish Play
		const spMembersData = [
			{ users_id: 2, show_id: 2, status: "active" }, // Jade: Co-Director & Actor
			{ users_id: 3, show_id: 2, status: "active" }, // Joshua: Director
			{ users_id: 5, show_id: 2, status: "active" }, // Aiden: Stage Manager & Photographer
			{ users_id: 14, show_id: 2, status: "active" }, // Rob: Santa/Conall
			{ users_id: 17, show_id: 2, status: "active" }, // Sarah: 1st Girl/Son 1
			{ users_id: 18, show_id: 2, status: "active" }, // Aaron: Prince/King of Lochlann
			{ users_id: 19, show_id: 2, status: "active" }, // Phillip: King of Eirann & Guard
			{ users_id: 22, show_id: 2, status: "active" }, // Kael: Son 2
			{ users_id: 23, show_id: 2, status: "active" }, // Cameron: Varb Leader & Miller & Kings Mother
			{ users_id: 25, show_id: 2, status: "active" }, // Max: Son 3
		];
		const spMembersWithPhotos = spMembersData.map((member) => ({
			...member,
			bio: showProfileDataByUserId[member.users_id]?.bio ?? null,
			photo_path: showProfileDataByUserId[member.users_id]?.photo_path ?? null,
		}));
		const spMembers = await models.ShowMembership.bulkCreate(
			spMembersWithPhotos,
			{ returning: true },
		);

		// Assign Show Roles for Santa in Space
		await models.ShowRoleRelationship.bulkCreate([
			{
				assignment_id: santaMembers.find((m) => m.users_id === 1).assignment_id,
				role_id: 100,
			}, // Laura: Director
			{
				assignment_id: santaMembers.find((m) => m.users_id === 2).assignment_id,
				role_id: 101,
			}, // Jade: Co-Director
			{
				assignment_id: santaMembers.find((m) => m.users_id === 2).assignment_id,
				role_id: 103,
			}, // Jade: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 5).assignment_id,
				role_id: 102,
			}, // Aiden: Stage Manager
			{
				assignment_id: santaMembers.find((m) => m.users_id === 5).assignment_id,
				role_id: 112,
			}, // Aiden: Photographer
			{
				assignment_id: santaMembers.find((m) => m.users_id === 6).assignment_id,
				role_id: 104,
			}, // Cathy: Choreographer
			{
				assignment_id: santaMembers.find((m) => m.users_id === 7).assignment_id,
				role_id: 105,
			}, // Lily: Dance Captain
			{
				assignment_id: santaMembers.find((m) => m.users_id === 7).assignment_id,
				role_id: 103,
			}, // Lily: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 8).assignment_id,
				role_id: 106,
			}, // Raine: Sound Design
			{
				assignment_id: santaMembers.find((m) => m.users_id === 4).assignment_id,
				role_id: 113,
			}, // Bill: Producer
			{
				assignment_id: santaMembers.find((m) => m.users_id === 9).assignment_id,
				role_id: 103,
			}, // Alex: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 10)
					.assignment_id,
				role_id: 103,
			}, // Dan: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 11)
					.assignment_id,
				role_id: 103,
			}, // Bowie: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 12)
					.assignment_id,
				role_id: 103,
			}, // Nora: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 13)
					.assignment_id,
				role_id: 103,
			}, // Jasmine: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 14)
					.assignment_id,
				role_id: 103,
			}, // Rob: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 15)
					.assignment_id,
				role_id: 103,
			}, // Lara: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 16)
					.assignment_id,
				role_id: 103,
			}, // Arwen: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 17)
					.assignment_id,
				role_id: 103,
			}, // Sarah: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 18)
					.assignment_id,
				role_id: 103,
			}, // Aaron: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 19)
					.assignment_id,
				role_id: 103,
			}, // Phillip: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 20)
					.assignment_id,
				role_id: 103,
			}, // Jessie: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 21)
					.assignment_id,
				role_id: 103,
			}, // Jordan: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 22)
					.assignment_id,
				role_id: 103,
			}, // Kael: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 23)
					.assignment_id,
				role_id: 103,
			}, // Cameron: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 24)
					.assignment_id,
				role_id: 103,
			}, // William: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 25)
					.assignment_id,
				role_id: 103,
			}, // Max: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 26)
					.assignment_id,
				role_id: 103,
			}, // Ruby: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 27)
					.assignment_id,
				role_id: 103,
			}, // Tamalane: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 28)
					.assignment_id,
				role_id: 103,
			}, // Elys: Actor
			{
				assignment_id: santaMembers.find((m) => m.users_id === 29)
					.assignment_id,
				role_id: 115,
			}, // Roland: Crew
			{
				assignment_id: santaMembers.find((m) => m.users_id === 30)
					.assignment_id,
				role_id: 115,
			}, // Kahlan: Crew
			{
				assignment_id: santaMembers.find((m) => m.users_id === 31)
					.assignment_id,
				role_id: 115,
			}, // Bekah: Crew
			{
				assignment_id: santaMembers.find((m) => m.users_id === 32)
					.assignment_id,
				role_id: 115,
			}, // Ward: Crew
			{
				assignment_id: santaMembers.find((m) => m.users_id === 33)
					.assignment_id,
				role_id: 114,
			}, // Maia: Makeup
			{
				assignment_id: santaMembers.find((m) => m.users_id === 34)
					.assignment_id,
				role_id: 114,
			}, // Kendra: Makeup
			{
				assignment_id: santaMembers.find((m) => m.users_id === 35)
					.assignment_id,
				role_id: 115,
			}, // Joel: Crew
		]);

		// Assign Show Roles for Scottish Play
		await models.ShowRoleRelationship.bulkCreate([
			{
				assignment_id: spMembers.find((m) => m.users_id === 3).assignment_id,
				role_id: 100,
			}, // Joshua: Director
			{
				assignment_id: spMembers.find((m) => m.users_id === 2).assignment_id,
				role_id: 101,
			}, // Jade: Co-Director
			{
				assignment_id: spMembers.find((m) => m.users_id === 5).assignment_id,
				role_id: 102,
			}, // Aiden: Stage Manager
			{
				assignment_id: spMembers.find((m) => m.users_id === 5).assignment_id,
				role_id: 112,
			}, // Aiden: Photographer
			{
				assignment_id: spMembers.find((m) => m.users_id === 5).assignment_id,
				role_id: 103,
			}, // Aiden: Actor
			{
				assignment_id: spMembers.find((m) => m.users_id === 14).assignment_id,
				role_id: 103,
			}, // Rob: Actor
			{
				assignment_id: spMembers.find((m) => m.users_id === 17).assignment_id,
				role_id: 103,
			}, // Sarah: Actor
			{
				assignment_id: spMembers.find((m) => m.users_id === 18).assignment_id,
				role_id: 103,
			}, // Aaron: Actor
			{
				assignment_id: spMembers.find((m) => m.users_id === 19).assignment_id,
				role_id: 103,
			}, // Phillip: Actor
			{
				assignment_id: spMembers.find((m) => m.users_id === 22).assignment_id,
				role_id: 103,
			}, // Kael: Actor
			{
				assignment_id: spMembers.find((m) => m.users_id === 23).assignment_id,
				role_id: 103,
			}, // Cameron: Actor
			{
				assignment_id: spMembers.find((m) => m.users_id === 25).assignment_id,
				role_id: 103,
			}, // Max: Actor
		]);

		// ------------------------
		// 7. Casting/Characters
		// ------------------------
		console.log("🎬 Seeding Character Casting...");

		// Santa in Space Characters
		const santaCasting = await models.Casting.bulkCreate([
			{ name: "Santa Claus", show_id: 1, users_id: 14 }, // Rob Foell
			{ name: "Captain Dick Daring", show_id: 1, users_id: 2 }, // Jade Edgar
			{ name: "Astra the Astrologer", show_id: 1, users_id: 7 }, // Lily Wilson
			{ name: "Vileun the Vile", show_id: 1, users_id: 9 }, // Alex Gallacher
			{ name: "Dame Dangle", show_id: 1, users_id: 10 }, // Dan Leckey
			{ name: "Null", show_id: 1, users_id: 11 }, // Bowie Farquarson
			{ name: "Void", show_id: 1, users_id: 3 }, // Joshua Farquarson
			{ name: "Little Tommy Tucker", show_id: 1, users_id: 12 }, // Nora Perry
			{ name: "Roberta", show_id: 1, users_id: 13 }, // Jasmine Wilson
			{ name: "Dancing Doll", show_id: 1, users_id: 15 }, // Lara Brunshot
			{ name: "Villager", show_id: 1, users_id: 15 }, // Lara Brunshot
			{ name: "Crystal", show_id: 1, users_id: 16 }, // Arwen Garside
			{ name: "1st Girl", show_id: 1, users_id: 17 }, // Sarah Chapeskie
			{ name: "Prince Paragon", show_id: 1, users_id: 18 }, // Aaron Montan
			{ name: "Monster", show_id: 1, users_id: 18 }, // Aaron Montan
			{ name: "Monster", show_id: 1, users_id: 19 }, // Phillip Allingham
			{ name: "Villager", show_id: 1, users_id: 19 }, // Phillip Allingham
			{ name: "1st Varborite", show_id: 1, users_id: 20 }, // Jessie Johnson
			{ name: "Villager", show_id: 1, users_id: 20 }, // Jessie Johnson
			{ name: "Villager", show_id: 1, users_id: 21 }, // Jordan Lyric
			{ name: "Villager", show_id: 1, users_id: 23 }, // Cameron Clark
			{ name: "Varborite Leader", show_id: 1, users_id: 23 }, // Cameron Clark
			{ name: "Kid", show_id: 1, users_id: 24 }, // William Gallacher
			{ name: "Kid", show_id: 1, users_id: 25 }, // Max Farquarson
			{ name: "Kid", show_id: 1, users_id: 26 }, // Ruby Lyric
			{ name: "Villager", show_id: 1, users_id: 27 }, // Tamalane Garside
			{ name: "Kid", show_id: 1, users_id: 28 }, // Elys Garside
			{ name: "Ethereal Fog", show_id: 1, users_id: 4 }, // Bill Levity
			{ name: "Monster", show_id: 1, users_id: 22 }, // Kael Reintjes
			{ name: "Villager", show_id: 1, users_id: 22 }, // Kael Reintjes
		]);

		// Scottish Play Characters
		const spCasting = await models.Casting.bulkCreate([
			{ name: "Conall Cra Bhuidhe", show_id: 2, users_id: 14 }, // Rob Foell
			{ name: "King of Lochlan", show_id: 2, users_id: 18 }, // Aaron Montan
			{ name: "King of Eirann", show_id: 2, users_id: 19 }, // Phillip Allingham (multi-role)
			{ name: "1st Son", show_id: 2, users_id: 17 }, // Sarah Chapeskie
			{ name: "2nd Son", show_id: 2, users_id: 22 }, // Kael Reintjes
			{ name: "3rd Son", show_id: 2, users_id: 25 }, // Max Farquarson
			{ name: "Miller", show_id: 2, users_id: 23 }, // Cameron Clark
			{ name: "Kings Mother", show_id: 2, users_id: 23 }, // Cameron Clark (multi-role)
			{ name: "Narrator", show_id: 2, users_id: 2 }, // Jade Edgar
			{ name: "Horse", show_id: 2, users_id: 5 },
		]);

		console.log(`   - ${santaCasting.length} Santa in Space characters cast`);
		console.log(`   - ${spCasting.length} Scottish Play characters cast`);

		// ------------------------
		// 5. Schedules/Rehearsals
		// ------------------------
		console.log("📅 Seeding Rehearsal Schedules...");

		const schedules = [];
		let scheduleId = 1;

		// Santa in Space Rehearsals
		const d1 = new Date(now);
		d1.setDate(d1.getDate() + 2);
		const d2 = new Date(now);
		d2.setDate(d2.getDate() + 5);
		const d3 = new Date(now);
		d3.setDate(d3.getDate() + 7);
		const d4 = new Date(now);
		d4.setDate(d4.getDate() + 10);
		const d5 = new Date(now);
		d5.setDate(d5.getDate() + 12);
		const d6 = new Date(now);
		d6.setDate(d6.getDate() + 14);
		const d7 = new Date(now);
		d7.setDate(d7.getDate() + 17);
		const d8 = new Date(now);
		d8.setDate(d8.getDate() + 19);

		schedules.push(
			{
				id: scheduleId++,
				title: "Full Cast Read-Through",
				start_time: d1,
				end_time: new Date(d1.getTime() + 10800000),
				location: "Main Stage",
				description: "Full cast read-through for Santa in Space",
				show_id: 1,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Act 1 Blocking & Choreography",
				start_time: d2,
				end_time: new Date(d2.getTime() + 14400000),
				location: "Dance Studio",
				description: "Act 1 blocking and dance choreography",
				show_id: 1,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Act 2 Blocking & Music",
				start_time: d3,
				end_time: new Date(d3.getTime() + 14400000),
				location: "Main Stage",
				description: "Act 2 blocking and music rehearsal",
				show_id: 1,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Sound Check & Tech Rehearsal",
				start_time: d4,
				end_time: new Date(d4.getTime() + 18000000),
				location: "Main Stage",
				description: "Sound system check and lighting tech run",
				show_id: 1,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Full Dress Rehearsal",
				start_time: d5,
				end_time: new Date(d5.getTime() + 14400000),
				location: "Main Stage",
				description: "Full dress rehearsal with costumes and props",
				show_id: 1,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Final Tech & Costume Run",
				start_time: d6,
				end_time: new Date(d6.getTime() + 14400000),
				location: "Main Stage",
				description: "Final tech and costume check",
				show_id: 1,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Makeup & Hair Trial",
				start_time: d7,
				end_time: new Date(d7.getTime() + 7200000),
				location: "Green Room",
				description: "Makeup and hair styling trial for all cast",
				show_id: 1,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Final Run-Through",
				start_time: d8,
				end_time: new Date(d8.getTime() + 14400000),
				location: "Main Stage",
				description: "Final complete run-through before opening",
				show_id: 1,
				org_id: 1,
			},
		);

		// Scottish Play Rehearsals
		const sp1 = new Date(inOneMonth);
		sp1.setDate(sp1.getDate() + 2);
		const sp2 = new Date(inOneMonth);
		sp2.setDate(sp2.getDate() + 5);
		const sp3 = new Date(inOneMonth);
		sp3.setDate(sp3.getDate() + 7);
		const sp4 = new Date(inOneMonth);
		sp4.setDate(sp4.getDate() + 10);
		const sp5 = new Date(inOneMonth);
		sp5.setDate(sp5.getDate() + 12);

		schedules.push(
			{
				id: scheduleId++,
				title: "Cast Read-Through - Scottish Play",
				start_time: sp1,
				end_time: new Date(sp1.getTime() + 10800000),
				location: "Main Stage",
				description:
					"Full cast read-through for The Tales of Conall Cra Bhuidhe",
				show_id: 2,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Act 1 Staging & Combat",
				start_time: sp2,
				end_time: new Date(sp2.getTime() + 14400000),
				location: "Main Stage",
				description: "Act 1 staging and sword combat choreography",
				show_id: 2,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Act 2 & 3 Staging",
				start_time: sp3,
				end_time: new Date(sp3.getTime() + 14400000),
				location: "Main Stage",
				description: "Acts 2 & 3 staging and movement",
				show_id: 2,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Lighting & Effects Rehearsal",
				start_time: sp4,
				end_time: new Date(sp4.getTime() + 18000000),
				location: "Main Stage",
				description: "Lighting cues and special effects setup",
				show_id: 2,
				org_id: 1,
			},
			{
				id: scheduleId++,
				title: "Final Dress Rehearsal",
				start_time: sp5,
				end_time: new Date(sp5.getTime() + 14400000),
				location: "Main Stage",
				description: "Full dress rehearsal with all technical elements",
				show_id: 2,
				org_id: 1,
			},
		);

		await models.Schedule.bulkCreate(schedules);

		// Schedule Assignments (Who is called to each rehearsal)
		const userSchedules = [];

		// Santa in Space attendance
		const santaCastIds = [
			1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
			22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
		];
		for (let i = 1; i <= 8; i++) {
			for (const userId of santaCastIds) {
				userSchedules.push({ schedules_id: i, users_id: userId });
			}
		}

		// Scottish Play attendance
		const spCastIds = [2, 3, 5, 14, 17, 18, 19, 22, 23, 25];
		for (let i = 9; i <= 13; i++) {
			for (const userId of spCastIds) {
				userSchedules.push({ schedules_id: i, users_id: userId });
			}
		}

		await models.UserSchedule.bulkCreate(userSchedules);

		// ------------------------
		// 6. Inventory
		// ------------------------
		console.log("📦 Seeding Inventory...");
		const inventory = [];
		let invId = 1;

		// Lighting Inventory
		inventory.push(
			{
				id: invId++,
				name: "ETC Source Four 36°",
				description: "Standard ellipsoidal reflector spotlight",
				dept_id: 1,
				is_global: 1,
				added_by: 5,
				org_id: 1,
				photo_path: "/uploads/inventory/etcsource4.jpg",
			},
			{
				id: invId++,
				name: "Chauvet COLORado 2 Quad",
				description: "LED moving head fixture",
				dept_id: 1,
				is_global: 1,
				added_by: 5,
				org_id: 1,
				photo_path: "/uploads/inventory/chauvetcolorado2quad.jpg",
			},
			{
				id: invId++,
				name: "ADJ Vizi Beam LED",
				description: "Moving head beam light",
				dept_id: 1,
				is_global: 1,
				added_by: 5,
				org_id: 1,
				photo_path: "/uploads/inventory/adjvizibeamled.webp",
			},
			{
				id: invId++,
				name: "Stage Lighting Console",
				description: "ETC Ion lighting control console",
				dept_id: 1,
				is_global: 1,
				added_by: 5,
				org_id: 1,
				photo_path: "/uploads/inventory/etcionlightingconsole.png",
			},
			{
				id: invId++,
				name: "Cyc Bar",
				description: "LED cyc light for backdrop",
				dept_id: 1,
				is_global: 1,
				added_by: 5,
				org_id: 1,
				photo_path: "/uploads/inventory/cycbar.webp",
			},
		);

		// Sound Inventory
		inventory.push(
			{
				id: invId++,
				name: "Shure SM58 Microphone",
				description: "Dynamic vocal microphone",
				dept_id: 2,
				is_global: 1,
				added_by: 8,
				org_id: 1,
				photo_path: "/uploads/inventory/shuresm58mic.jpg",
			},
			{
				id: invId++,
				name: "Wireless Mic Pack",
				description: "Shure ULX wireless microphone system",
				dept_id: 2,
				is_global: 1,
				added_by: 8,
				org_id: 1,
				photo_path: "/uploads/inventory/shureulxwirelessmic.webp",
			},
			{
				id: invId++,
				name: "Soundcraft Si Mixer",
				description: "Digital sound mixing console",
				dept_id: 2,
				is_global: 1,
				added_by: 8,
				org_id: 1,
				photo_path: "/uploads/inventory/soundcraftsimixer.jpg",
			},
			{
				id: invId++,
				name: "JBL PA Speakers",
				description: "Professional PA speaker pair",
				dept_id: 2,
				is_global: 1,
				added_by: 8,
				org_id: 1,
				photo_path: "/uploads/inventory/jblpaspeakers.jpg",
			},
		);

		// Costume Inventory
		inventory.push(
			{
				id: invId++,
				name: "Santa Suit",
				description: "Full Santa costume for Santa in Space",
				dept_id: 3,
				is_global: 0,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/santasuit.jpg",
			},
			{
				id: invId++,
				name: "Alien Costumes Set",
				description: "Colorful alien outfits (10 pieces)",
				dept_id: 3,
				is_global: 0,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/aliencostume.jpg",
			},
			{
				id: invId++,
				name: "Victorian Period Costumes",
				description: "Scottish Play period costumes",
				dept_id: 3,
				is_global: 0,
				added_by: 3,
				org_id: 1,
				photo_path: "/uploads/inventory/victorianscottishcostume.webp",
			},
			{
				id: invId++,
				name: "Wig Collection",
				description: "Various wigs for characters",
				dept_id: 3,
				is_global: 1,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/wigs.webp",
			},
			{
				id: invId++,
				name: "Dance Costumes",
				description: "Modern dance costumes (8 pieces)",
				dept_id: 3,
				is_global: 0,
				added_by: 6,
				org_id: 1,
				photo_path: "/uploads/inventory/dancecostume.webp",
			},
		);

		// Props Inventory
		inventory.push(
			{
				id: invId++,
				name: "Prop Space Blaster",
				description: "Futuristic gun prop for Santa in Space",
				dept_id: 4,
				is_global: 0,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/spaceblasterprop.jpg",
			},
			{
				id: invId++,
				name: "Scottish Claymore Sword",
				description: "Replica sword for fight choreography",
				dept_id: 4,
				is_global: 0,
				added_by: 3,
				org_id: 1,
				photo_path: "/uploads/inventory/scottishclaymore.JPG",
			},
			{
				id: invId++,
				name: "Prop Presents & Gifts",
				description: "Gift boxes and wrapped presents",
				dept_id: 4,
				is_global: 0,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/giftboxesprop.jpg",
			},
			{
				id: invId++,
				name: "Crowns & Tiaras",
				description: "Assorted royal headpieces",
				dept_id: 4,
				is_global: 1,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/crowns.jpg",
			},
			{
				id: invId++,
				name: "Scepters & Staffs",
				description: "Royal and magical staffs",
				dept_id: 4,
				is_global: 1,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/royalstaff.jpg",
			},
		);

		// Sets/Scenic Inventory
		inventory.push(
			{
				id: invId++,
				name: "Space Ship Set Pieces",
				description: "Modular spaceship set elements",
				dept_id: 5,
				is_global: 0,
				added_by: 3,
				org_id: 1,
				photo_path: "/uploads/inventory/spaceshipset.webp",
			},
			{
				id: invId++,
				name: "Castle Backdrop",
				description: "Large backdrop for Scottish scenes",
				dept_id: 5,
				is_global: 0,
				added_by: 3,
				org_id: 1,
				photo_path: "/uploads/inventory/castlebackdrop.jpg",
			},
			{
				id: invId++,
				name: "Throne Chair",
				description: "Ornate throne for royal scenes",
				dept_id: 5,
				is_global: 1,
				added_by: 3,
				org_id: 1,
				photo_path: "/uploads/inventory/throne.webp",
			},
			{
				id: invId++,
				name: "Stairs & Platforms",
				description: "Modular stage stairs (6 units)",
				dept_id: 5,
				is_global: 1,
				added_by: 3,
				org_id: 1,
				photo_path: "/uploads/inventory/stagestairs.jpeg",
			},
			{
				id: invId++,
				name: "Door Frames",
				description: "Portable door frames (4 units)",
				dept_id: 5,
				is_global: 1,
				added_by: 3,
				org_id: 1,
				photo_path: "/uploads/inventory/doorframe.webp",
			},
		);

		// Front of House
		inventory.push(
			{
				id: invId++,
				name: "Easel Signs",
				description: "Welcome/Info easel signs (4)",
				dept_id: 6,
				is_global: 1,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/easel.jpg",
			},
			{
				id: invId++,
				name: "Program Printing Setup",
				description: "Poster and program printing materials",
				dept_id: 6,
				is_global: 1,
				added_by: 1,
				org_id: 1,
				photo_path: "/uploads/inventory/programprinting.jpg",
			},
		);

		await models.Inventory.bulkCreate(inventory);

		// Link inventory to shows
		const showInventories = [
			// Santa in Space - Lighting
			{ inventory_id: 1, shows_id: 1, user_id: 5 },
			{ inventory_id: 2, shows_id: 1, user_id: 5 },
			{ inventory_id: 3, shows_id: 1, user_id: 5 },
			{ inventory_id: 4, shows_id: 1, user_id: 5 },
			{ inventory_id: 5, shows_id: 1, user_id: 5 },
			// Santa in Space - Sound
			{ inventory_id: 6, shows_id: 1, user_id: 8 },
			{ inventory_id: 7, shows_id: 1, user_id: 8 },
			{ inventory_id: 8, shows_id: 1, user_id: 8 },
			{ inventory_id: 9, shows_id: 1, user_id: 8 },
			// Santa in Space - Costumes
			{ inventory_id: 10, shows_id: 1, user_id: 1 },
			{ inventory_id: 11, shows_id: 1, user_id: 1 },
			{ inventory_id: 13, shows_id: 1, user_id: 1 },
			{ inventory_id: 14, shows_id: 1, user_id: 1 },
			// Santa in Space - Props
			{ inventory_id: 15, shows_id: 1, user_id: 1 },
			{ inventory_id: 17, shows_id: 1, user_id: 1 },
			{ inventory_id: 18, shows_id: 1, user_id: 1 },
			{ inventory_id: 19, shows_id: 1, user_id: 1 },
			// Santa in Space - Sets
			{ inventory_id: 20, shows_id: 1, user_id: 3 },
			{ inventory_id: 22, shows_id: 1, user_id: 3 },
			{ inventory_id: 23, shows_id: 1, user_id: 3 },
			// Scottish Play - Lighting
			{ inventory_id: 1, shows_id: 2, user_id: 5 },
			{ inventory_id: 2, shows_id: 2, user_id: 5 },
			{ inventory_id: 4, shows_id: 2, user_id: 5 },
			// Scottish Play - Sound
			{ inventory_id: 6, shows_id: 2, user_id: 8 },
			{ inventory_id: 8, shows_id: 2, user_id: 8 },
			// Scottish Play - Costumes
			{ inventory_id: 12, shows_id: 2, user_id: 1 },
			{ inventory_id: 13, shows_id: 2, user_id: 1 },
			// Scottish Play - Props
			{ inventory_id: 16, shows_id: 2, user_id: 1 },
			{ inventory_id: 18, shows_id: 2, user_id: 1 },
			{ inventory_id: 19, shows_id: 2, user_id: 1 },
			// Scottish Play - Sets
			{ inventory_id: 21, shows_id: 2, user_id: 3 },
			{ inventory_id: 22, shows_id: 2, user_id: 3 },
			{ inventory_id: 23, shows_id: 2, user_id: 3 },
			{ inventory_id: 24, shows_id: 2, user_id: 3 },
		];

		await models.ShowInventory.bulkCreate(showInventories);

		// ------------------------
		// Summary
		// ------------------------
		console.log("✅ Test data seeded successfully!");
		console.log(`   - ${usersData.length} Users created`);
		console.log(`   - 1 Organization created (Shawnigan Players)`);
		console.log(`   - 2 Shows created (Santa in Space, Scottish Play)`);
		console.log(`   - ${schedules.length} Rehearsal/Schedule Events created`);
		console.log(`   - ${inventory.length} Inventory Items created`);
		console.log(`   - ${santaCasting.length} Santa in Space characters cast`);
		console.log(`   - ${spCasting.length} Scottish Play characters cast`);
	} catch (err) {
		console.error("❌ Seeding failed:", err);
	} finally {
		// Close the connection so the script doesn't hang
		await sequelize.close();
	}
}

// Execute the seed function
seed();
