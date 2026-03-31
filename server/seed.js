import bcrypt from "bcryptjs";

import models from "./src/models/index.js";
import sequelize from "./src/services/db.service.js";

export default async function seed() {
    try {
        console.log("🔄 Wiping database and syncing tables...");
        await sequelize.sync({ force: true }); // Wipes and recreates tables based on models

        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(now.getMonth() + 1);

        // ------------------------
        // 1. Roles & Departments
        // ------------------------
        console.log("🌱 Seeding Roles & Departments...");

        await models.OrganizationRole.bulkCreate([
            { id: 1, name: "president" }, { id: 2, name: "board-member" }, { id: 3, name: "general" },
            { id: 4, name: "costumes" }, { id: 5, name: "props" }, { id: 6, name: "sets" }, { id: 7, name: "tech" }
        ]);

        await models.ShowRole.bulkCreate([
            { id: 100, name: "director" }, { id: 101, name: "stage-manager" }, { id: 102, name: "actor" },
            { id: 103, name: "costumes" }, { id: 104, name: "props" }, { id: 105, name: "sets" },
            { id: 106, name: "tech" }, { id: 107, name: "lighting-design" }
        ]);

        await models.Department.bulkCreate([
            { id: 1, name: "Lighting" }, { id: 2, name: "Sound" }, { id: 3, name: "Costumes" },
            { id: 4, name: "Props" }, { id: 5, name: "Scenic" }, { id: 6, name: "Front of House" }
        ]);

        // ------------------------
        // 2. Users
        // ------------------------
        console.log("👥 Seeding Users...");
        const passwordHash = await bcrypt.hash("password123", 10);

        const usersData = [
            { id: 1, fname: "Aiden", lname: "Smith", email: "aiden@example.com", phone: "555-0101", passwordHash },
            { id: 2, fname: "Laura", lname: "Johnson", email: "laura@example.com", phone: "555-0102", passwordHash },
            { id: 3, fname: "Liam", lname: "Davies", email: "liam.uk@example.com", phone: "555-0103", passwordHash },
            { id: 4, fname: "Sarah", lname: "Miller", email: "sarah@example.com", phone: "555-0104", passwordHash },
            { id: 5, fname: "Marcus", lname: "Chen", email: "marcus@example.com", phone: "555-0105", passwordHash },
            { id: 6, fname: "Elena", lname: "Rodriguez", email: "elena@example.com", phone: "555-0106", passwordHash },
            { id: 7, fname: "David", lname: "Kim", email: "david@example.com", phone: "555-0107", passwordHash },
            { id: 8, fname: "Rachel", lname: "Green", email: "rachel@example.com", phone: "555-0108", passwordHash },
            { id: 9, fname: "James", lname: "Taylor", email: "james@example.com", phone: "555-0109", passwordHash },
            { id: 10, fname: "Chloe", lname: "Martin", email: "chloe@example.com", phone: "555-0110", passwordHash }
        ];
        await models.User.bulkCreate(usersData);

        // ------------------------
        // 3. Organization & Memberships
        // ------------------------
        console.log("🏢 Seeding Organizations & Memberships...");
        const org = await models.Organization.create({ id: 1, name: "Cowichan Valley Players" });

        // Add all 10 users to the organizations
        const orgMembershipsData = usersData.map(u => ({
            users_id: u.id,
            org_id: org.id,
            status: "active"
        }));
        const orgMemberships = await models.OrgMembership.bulkCreate(orgMembershipsData, { returning: true });

        // Assign specific organizations roles
        await models.OrgRoleRelationship.bulkCreate([
            { assignment_id: orgMemberships.find(m => m.users_id === 4).assignment_id, role_id: 1 }, // Sarah: President
            { assignment_id: orgMemberships.find(m => m.users_id === 5).assignment_id, role_id: 2 }, // Marcus: Board
            { assignment_id: orgMemberships.find(m => m.users_id === 6).assignment_id, role_id: 2 }, // Elena: Board
            { assignment_id: orgMemberships.find(m => m.users_id === 1).assignment_id, role_id: 7 }  // Aiden: Tech
        ]);

        // ------------------------
        // 4. Shows & Show Memberships
        // ------------------------
        console.log("🎭 Seeding Shows & Cast/Crew...");
        const shows = await models.Show.bulkCreate([
            { id: 1, title: "Rock of Ages", start_date: now, end_date: nextMonth, organization_id: org.id },
            { id: 2, title: "Steel Magnolias", start_date: nextMonth, end_date: new Date(nextMonth.getTime() + 2592000000), organization_id: org.id }
        ]);

        // Assign Cast & Crew to Rock of Ages (Show 1)
        const roaMembersData = [
            { users_id: 1, show_id: 1, status: "active" }, // Aiden
            { users_id: 2, show_id: 1, status: "active" }, // Laura
            { users_id: 4, show_id: 1, status: "active" }, // Sarah
            { users_id: 5, show_id: 1, status: "active" }, // Marcus
            { users_id: 7, show_id: 1, status: "active" }, // David
            { users_id: 8, show_id: 1, status: "active" }, // Rachel
            { users_id: 3, show_id: 1, status: "active" }  // Liam
        ];
        const roaMembers = await models.ShowMembership.bulkCreate(roaMembersData, { returning: true });

        // Assign Show Roles for Rock of Ages
        await models.ShowRoleRelationship.bulkCreate([
            { assignment_id: roaMembers.find(m => m.users_id === 4).assignment_id, role_id: 100 }, // Sarah: Director
            { assignment_id: roaMembers.find(m => m.users_id === 2).assignment_id, role_id: 101 }, // Laura: Stage Manager
            { assignment_id: roaMembers.find(m => m.users_id === 1).assignment_id, role_id: 107 }, // Aiden: Lighting Design
            { assignment_id: roaMembers.find(m => m.users_id === 1).assignment_id, role_id: 106 }, // Aiden: Tech
            { assignment_id: roaMembers.find(m => m.users_id === 5).assignment_id, role_id: 102 }, // Marcus: Actor
            { assignment_id: roaMembers.find(m => m.users_id === 7).assignment_id, role_id: 102 }, // David: Actor
            { assignment_id: roaMembers.find(m => m.users_id === 8).assignment_id, role_id: 102 }, // Rachel: Actor
            { assignment_id: roaMembers.find(m => m.users_id === 3).assignment_id, role_id: 105 }  // Liam: Sets
        ]);

        // ------------------------
        // 5. Schedules
        // ------------------------
        console.log("📅 Seeding Schedules...");
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
        const inThreeDays = new Date(now); inThreeDays.setDate(inThreeDays.getDate() + 3);
        const techWeek = new Date(now); techWeek.setDate(techWeek.getDate() + 14);

        await models.Schedule.bulkCreate([
            { id: 1, title: "Read-Through & Music Rehearsal", start_time: tomorrow, end_time: new Date(tomorrow.getTime() + 10800000), location: "Main Hall", description: "Full cast read-through.", show_id: 1, org_id: 1 },
            { id: 2, title: "Choreography: Don't Stop Believin'", start_time: inThreeDays, end_time: new Date(inThreeDays.getTime() + 7200000), location: "Dance Studio", description: "Wear comfortable clothes.", show_id: 1, org_id: 1 },
            { id: 3, title: "Lighting Plot Hang & Focus", start_time: techWeek, end_time: new Date(techWeek.getTime() + 18000000), location: "Main Stage", description: "All tech crew required.", show_id: 1, org_id: 1 }
        ]);

        // Schedule Assignments (Who is called)
        await models.UserSchedule.bulkCreate([
            { schedules_id: 1, users_id: 4 }, { schedules_id: 1, users_id: 2 }, { schedules_id: 1, users_id: 5 }, { schedules_id: 1, users_id: 7 }, { schedules_id: 1, users_id: 8 },
            { schedules_id: 2, users_id: 4 }, { schedules_id: 2, users_id: 5 }, { schedules_id: 2, users_id: 8 },
            { schedules_id: 3, users_id: 1 }, { schedules_id: 3, users_id: 2 }, { schedules_id: 3, users_id: 3 }
        ]);

        // ------------------------
        // 6. Inventory
        // ------------------------
        console.log("📦 Seeding Inventory...");
        await models.Inventory.bulkCreate([
            { id: 1, name: "ETC Source Four 36°", description: "Standard ellipsoidal reflector spotlight.", dept_id: 1, is_global: 1, added_by: 1, org_id: 1, photo_path: "/uploads/spotlight.png" },
            { id: 2, name: "Chauvet ColorSource PAR", description: "LED wash fixture.", dept_id: 1, is_global: 1, added_by: 1, org_id: 1, photo_path: "/uploads/ledwash.jpg" },
            { id: 3, name: "Shure SM58", description: "Dynamic vocal microphone.", dept_id: 2, is_global: 1, added_by: 1, org_id: 1, photo_path: "/uploads/mic.jpg" },
            { id: 4, name: "Vintage Leather Jacket", description: "Studded 80s jacket.", dept_id: 3, is_global: 0, added_by: 4, org_id: 1, photo_path: "/uploads/leatherjacket.webp" },
            { id: 5, name: "Fake Electric Guitar", description: "Prop Gibson Les Paul replica.", dept_id: 4, is_global: 0, added_by: 2, org_id: 1, photo_path: "/uploads/guitar.webp" }
        ]);

        // Link specific items to Rock of Ages
        await models.ShowInventory.bulkCreate([
            { inventory_id: 1, shows_id: 1, user_id: 1 },
            { inventory_id: 2, shows_id: 1, user_id: 1 },
            { inventory_id: 4, shows_id: 1, user_id: 4 },
            { inventory_id: 5, shows_id: 1, user_id: 2 }
        ]);

        // ------------------------
        // Summary
        // ------------------------
        console.log("✅ Test data seeded successfully!");
        console.log(`   - 10 Users created`);
        console.log(`   - 1 Organization created`);
        console.log(`   - 2 Shows created`);
        console.log(`   - 3 Schedule Events created`);
        console.log(`   - 5 Inventory Items created`);

    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        // Close the connection so the script doesn't hang
        await sequelize.close();
    }
}

// Execute the seed function
seed();