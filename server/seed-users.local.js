const userSeedRows = [
	[1, "Laura", "Gibson", "aidenadzich@gmail.com"],
	[2, "Jade", "Edgar", "jade.edgar@example.com"],
	[3, "Joshua", "Farquarson", "joshua.farquarson@example.com"],
	[4, "Bill", "Levity", "levitybill@gmail.com"],
	[5, "Aiden", "Hughes", "aiden.hughes@example.com"],
	[6, "Cathy", "Morrison", "cathy.morrison@example.com"],
	[7, "Lily", "Parker", "lilyparker25@outlook.com"],
	[8, "Raine", "Douglas", "raine.douglas@example.com"],
	[9, "Alex", "Gallacher", "alex.gallacher@example.com"],
	[10, "Dan", "Leckey", "dan.leckey@example.com"],
	[11, "Bowie", "Farquarson", "bowie.farquarson@example.com"],
	[12, "Nora", "Perry", "nora.perry@example.com"],
	[13, "Jasmine", "Wilson", "jasmine.wilson@example.com"],
	[14, "Rob", "Foell", "rob.foell@example.com"],
	[15, "Lara", "Brunshot", "lara.brunshot@example.com"],
	[16, "Arwen", "Garside", "arwen.garside@example.com"],
	[17, "Sarah", "Chapeskie", "sarah.chapeskie@example.com"],
	[18, "Aaron", "Montan", "aaron.montan@example.com"],
	[19, "Phillip", "Allingham", "phillip.allingham@example.com"],
	[20, "Jessie", "Johnson", "jessie.johnson@example.com"],
	[21, "Jordan", "Lyric", "jordan.lyric@example.com"],
	[22, "Kael", "Reintjes", "kael.reintjes@example.com"],
	[23, "Cameron", "Clark", "cameron.clark@example.com"],
	[24, "William", "Gallacher", "william.gallacher@example.com"],
	[25, "Max", "Farquarson", "max.farquarson@example.com"],
	[26, "Ruby", "Lyric", "ruby.lyric@example.com"],
	[27, "Tamalane", "Garside", "tamalane.garside@example.com"],
	[28, "Elys", "Garside", "elys.garside@example.com"],
	[29, "Roland", "Morrison", "roland.morrison@example.com"],
	[30, "Kahlan", "Morrison", "kahlan.morrison@example.com"],
	[31, "Bekah", "Morrison", "bekah.morrison@example.com"],
	[32, "Ward", "Morrison", "ward.morrison@example.com"],
	[33, "Maia", "Douglas", "maia.douglas@example.com"],
	[34, "Kendra", "Douglas", "kendra.douglas@example.com"],
	[35, "Joel", "Morrison", "joel.morrison@example.com"],
];

const usersData = userSeedRows.map(([id, fname, lname, email]) => ({
	id,
	fname,
	lname,
	email,
}));

const showProfileDataByUserId = Object.fromEntries(
	userSeedRows.map(([id]) => [id, { bio: null, photo_path: null }]),
);

export const seedUsers = {
	usersData,
	showProfileDataByUserId,
};
