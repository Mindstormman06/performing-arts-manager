# Tailwind Audit Report

Generated for read-only review. No Tailwind classes were changed.

## Scope

- Workspace root: `C:\Users\Aiden\Documents\performing-arts-manager`
- Files scanned: **108** (`.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.mdx`) excluding `node_modules`, `coverage`, `dist`, `build`, `.git`.
- Extraction method: string values of `class` and `className` attributes.
- This report includes full usage lists (no truncated `+N more` entries).

## 1) Repeated full class strings (with extraction context)

Found **107** repeated full class strings.

### `mb-1 block text-sm font-medium text-gray-700`
- Why review/group this: Form label typography pattern is repeated; centralizing this avoids label inconsistency.
- Usage summary: **28** uses across **6** files
- All usages:
- `client/src/components/CreateEventModal.jsx:130` - `<label htmlFor="create-event-title" className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>`
- `client/src/components/CreateEventModal.jsx:143` - `<label htmlFor="create-event-date" className="mb-1 block text-sm font-medium text-gray-700">Date</label>`
- `client/src/components/CreateEventModal.jsx:154` - `<label htmlFor="create-event-start-time" className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>`
- `client/src/components/CreateEventModal.jsx:165` - `<label htmlFor="create-event-end-time" className="mb-1 block text-sm font-medium text-gray-700">End Time</label>`
- `client/src/components/CreateEventModal.jsx:178` - `<label htmlFor="create-event-location" className="mb-1 block text-sm font-medium text-gray-700">Location</label>`
- `client/src/components/CreateEventModal.jsx:190` - `<label htmlFor="create-event-description" className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>`
- `client/src/components/CreateInventoryModal.jsx:52` - `<label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>`
- `client/src/components/CreateInventoryModal.jsx:63` - `<label className="mb-1 block text-sm font-medium text-gray-700">Department</label>`
- `client/src/components/CreateInventoryModal.jsx:78` - `<label className="mb-1 block text-sm font-medium text-gray-700">Description</label>`
- `client/src/components/CreateOrgEventModal.jsx:130` - `<label htmlFor="create-org-event-title" className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>`
- `client/src/components/CreateOrgEventModal.jsx:136` - `<label htmlFor="create-org-event-date" className="mb-1 block text-sm font-medium text-gray-700">Date</label>`
- `client/src/components/CreateOrgEventModal.jsx:140` - `<label htmlFor="create-org-event-start-time" className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>`
- `client/src/components/CreateOrgEventModal.jsx:144` - `<label htmlFor="create-org-event-end-time" className="mb-1 block text-sm font-medium text-gray-700">End Time</label>`
- `client/src/components/CreateOrgEventModal.jsx:150` - `<label htmlFor="create-org-event-location" className="mb-1 block text-sm font-medium text-gray-700">Location</label>`
- `client/src/components/CreateOrgEventModal.jsx:155` - `<label htmlFor="create-org-event-description" className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>`
- `client/src/components/ManageEventModal.jsx:156` - `<label className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>`
- `client/src/components/ManageEventModal.jsx:161` - `<label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>`
- `client/src/components/ManageEventModal.jsx:165` - `<label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>`
- `client/src/components/ManageEventModal.jsx:170` - `<label className="mb-1 block text-sm font-medium text-gray-700">Location</label>`
- `client/src/components/ManageEventModal.jsx:174` - `<label className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>`
- `client/src/components/ManageOrgEventModal.jsx:134` - `<label className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>`
- `client/src/components/ManageOrgEventModal.jsx:139` - `<label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>`
- `client/src/components/ManageOrgEventModal.jsx:143` - `<label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>`
- `client/src/components/ManageOrgEventModal.jsx:148` - `<label className="mb-1 block text-sm font-medium text-gray-700">Location</label>`
- `client/src/components/ManageOrgEventModal.jsx:152` - `<label className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>`
- `client/src/components/ManageShowInventoryModal.jsx:122` - `<label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>`
- `client/src/components/ManageShowInventoryModal.jsx:126` - `<label className="mb-1 block text-sm font-medium text-gray-700">Department</label>`
- `client/src/components/ManageShowInventoryModal.jsx:135` - `<label className="mb-1 block text-sm font-medium text-gray-700">Description</label>`

### `w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500`
- Why review/group this: Form input baseline styling is repeated; a shared input class/primitive would reduce drift.
- Usage summary: **22** uses across **4** files
- All usages:
- `client/src/components/CreateEventModal.jsx:137` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:150` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:161` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:172` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:184` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:196` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateOrgEventModal.jsx:131` - `<input id="create-org-event-title" type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:137` - `<input id="create-org-event-date" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:141` - `<input id="create-org-event-start-time" type="time" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:145` - `<input id="create-org-event-end-time" type="time" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:151` - `<input id="create-org-event-location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" placeholder="Optional" />`
- `client/src/components/CreateOrgEventModal.jsx:156` - `<textarea id="create-org-event-description" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" placeholder="Optional notes..."></textarea>`
- `client/src/components/ManageEventModal.jsx:157` - `<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:162` - `<input type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:166` - `<input type="datetime-local" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:171` - `<input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:175` - `<textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"></textarea>`
- `client/src/components/ManageOrgEventModal.jsx:135` - `<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:140` - `<input type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:144` - `<input type="datetime-local" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:149` - `<input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:153` - `<textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"></textarea>`

### `space-y-4`
- Why review/group this: Cross-file repeated layout/styling pattern; likely worth extracting into shared UI primitive styles.
- Usage summary: **12** uses across **11** files
- All usages:
- `client/src/components/CreateEventModal.jsx:128` - `<div className="space-y-4">`
- `client/src/components/CreateInventoryModal.jsx:48` - `<form onSubmit={handleSubmit} className="space-y-4">`
- `client/src/components/CreateOrgEventModal.jsx:128` - `<div className="space-y-4">`
- `client/src/components/ManageEventModal.jsx:154` - `<form id="update-event-form" onSubmit={handleUpdateDetails} className="space-y-4">`
- `client/src/components/ManageOrgEventModal.jsx:132` - `<form id="update-org-event-form" onSubmit={handleUpdateDetails} className="space-y-4">`
- `client/src/components/ManageShowInventoryModal.jsx:120` - `<form id="create-item-form" onSubmit={handleCreateSubmit} className="space-y-4">`
- `client/src/pages/Login.jsx:31` - `<form onSubmit={handleSubmit} className="space-y-4">`
- `client/src/pages/OrgDashboard.jsx:79` - `<div className="space-y-4">`
- `client/src/pages/OrgDashboard.jsx:133` - `<div className="space-y-4">`
- `client/src/pages/OrgSchedule.jsx:71` - `<div className="space-y-4">`
- `client/src/pages/ShowSchedule.jsx:89` - `<div className="space-y-4">`
- `client/src/pages/Signup.jsx:41` - `<form onSubmit={handleSubmit} className="space-y-4">`

### `rounded-lg border border-gray-200 p-4`
- Why review/group this: Cross-file repeated layout/styling pattern; likely worth extracting into shared UI primitive styles.
- Usage summary: **8** uses across **4** files
- All usages:
- `client/src/components/CreateEventModal.jsx:208` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/CreateEventModal.jsx:221` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/CreateOrgEventModal.jsx:166` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/CreateOrgEventModal.jsx:179` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/ManageEventModal.jsx:187` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/ManageEventModal.jsx:201` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/ManageOrgEventModal.jsx:163` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/ManageOrgEventModal.jsx:176` - `<div className="rounded-lg border border-gray-200 p-4">`

### `w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **7** uses across **2** files
- All usages:
- `client/src/pages/Login.jsx:37` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Login.jsx:45` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:46` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:53` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:61` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:69` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:77` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`

### `fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4`
- Why review/group this: Modal shell pattern repeated across multiple overlays; good candidate for a shared modal wrapper class/component.
- Usage summary: **6** uses across **6** files
- All usages:
- `client/src/components/CreateEventModal.jsx:102` - `<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">`
- `client/src/components/CreateInventoryModal.jsx:39` - `<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">`
- `client/src/components/CreateOrgEventModal.jsx:102` - `<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">`
- `client/src/components/ManageEventModal.jsx:126` - `<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">`
- `client/src/components/ManageOrgEventModal.jsx:116` - `<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">`
- `client/src/components/ManageShowInventoryModal.jsx:63` - `<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">`

### `flex-1`
- Why review/group this: Cross-file repeated layout/styling pattern; likely worth extracting into shared UI primitive styles.
- Usage summary: **6** uses across **6** files
- All usages:
- `client/src/components/ui/DashboardSection.jsx:11` - `className = "flex-1",`
- `client/src/pages/OrgInventory.jsx:122` - `className="flex-1"`
- `client/src/pages/OrgOverview.jsx:144` - `className="flex-1"`
- `client/src/pages/OrgSchedule.jsx:70` - `<DashboardSection title="Upcoming Events" actionTitle="Create Event" onActionClick={canManageSchedule ? () => setIsCreateModalOpen(true) : undefined} className="flex-1">`
- `client/src/pages/ShowInventory.jsx:108` - `className="flex-1"`
- `client/src/pages/ShowSchedule.jsx:87` - `className="flex-1"`

### `flex-1 overflow-y-auto`
- Why review/group this: Cross-file repeated layout/styling pattern; likely worth extracting into shared UI primitive styles.
- Usage summary: **6** uses across **6** files
- All usages:
- `client/src/components/CreateEventModal.jsx:126` - `<div className="flex-1 overflow-y-auto">`
- `client/src/components/CreateOrgEventModal.jsx:126` - `<div className="flex-1 overflow-y-auto">`
- `client/src/components/ManageEventModal.jsx:151` - `<div className="flex-1 overflow-y-auto">`
- `client/src/components/ManageOrgEventModal.jsx:130` - `<div className="flex-1 overflow-y-auto">`
- `client/src/components/ManageShowInventoryModal.jsx:88` - `<div className="flex-1 overflow-y-auto">`
- `client/src/pages/ShowOverview.jsx:161` - `<main className="flex-1 overflow-y-auto">`

### `h-4 w-4 rounded text-blue-600`
- Why review/group this: Cross-file repeated layout/styling pattern; likely worth extracting into shared UI primitive styles.
- Usage summary: **6** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:213` - `<input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/CreateEventModal.jsx:226` - `<input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/CreateOrgEventModal.jsx:171` - `<input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/CreateOrgEventModal.jsx:184` - `<input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/ManageOrgEventModal.jsx:168` - `<input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/ManageOrgEventModal.jsx:181` - `<input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 rounded text-blue-600" />`

### `mb-3 font-semibold text-gray-800`
- Why review/group this: Cross-file repeated layout/styling pattern; likely worth extracting into shared UI primitive styles.
- Usage summary: **6** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:209` - `<h3 className="mb-3 font-semibold text-gray-800">Assign by Role</h3>`
- `client/src/components/CreateEventModal.jsx:222` - `<h3 className="mb-3 font-semibold text-gray-800">Assign Specific Individuals</h3>`
- `client/src/components/CreateOrgEventModal.jsx:167` - `<h3 className="mb-3 font-semibold text-gray-800">Assign by Role</h3>`
- `client/src/components/CreateOrgEventModal.jsx:180` - `<h3 className="mb-3 font-semibold text-gray-800">Assign Specific Individuals</h3>`
- `client/src/components/ManageOrgEventModal.jsx:164` - `<h3 className="mb-3 font-semibold text-gray-800">Assign by Role</h3>`
- `client/src/components/ManageOrgEventModal.jsx:177` - `<h3 className="mb-3 font-semibold text-gray-800">Assign Specific Individuals</h3>`

### `px-6 py-4 font-semibold`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **6** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:150` - `<th className="px-6 py-4 font-semibold">Item Name</th>`
- `client/src/pages/OrgInventory.jsx:151` - `<th className="px-6 py-4 font-semibold">Department</th>`
- `client/src/pages/OrgInventory.jsx:152` - `<th className="px-6 py-4 font-semibold">Description</th>`
- `client/src/pages/ShowInventory.jsx:122` - `<th className="px-6 py-4 font-semibold">Item Name</th>`
- `client/src/pages/ShowInventory.jsx:123` - `<th className="px-6 py-4 font-semibold">Department</th>`
- `client/src/pages/ShowInventory.jsx:124` - `<th className="px-6 py-4 font-semibold">Origin</th>`

### `rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50`
- Why review/group this: Primary action button styling is repeated; this can be centralized into a reusable button variant.
- Usage summary: **6** uses across **6** files
- All usages:
- `client/src/components/CreateEventModal.jsx:243` - `<button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/CreateInventoryModal.jsx:99` - `className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"`
- `client/src/components/CreateOrgEventModal.jsx:199` - `<button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/ManageEventModal.jsx:231` - `<button type="submit" form="update-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/ManageOrgEventModal.jsx:199` - `<button type="submit" form="update-org-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">{isLoading ? "Saving..." : "Save Details"}</button>`
- `client/src/components/ManageShowInventoryModal.jsx:147` - `<button type="submit" form="create-item-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`

### `rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100`
- Why review/group this: Cross-file repeated layout/styling pattern; likely worth extracting into shared UI primitive styles.
- Usage summary: **6** uses across **6** files
- All usages:
- `client/src/components/CreateEventModal.jsx:242` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>`
- `client/src/components/CreateInventoryModal.jsx:92` - `className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100"`
- `client/src/components/CreateOrgEventModal.jsx:198` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>`
- `client/src/components/ManageEventModal.jsx:228` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Done</button>`
- `client/src/components/ManageOrgEventModal.jsx:197` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Done</button>`
- `client/src/components/ManageShowInventoryModal.jsx:146` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>`

### `w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`
- Why review/group this: Form input baseline styling is repeated; a shared input class/primitive would reduce drift.
- Usage summary: **6** uses across **2** files
- All usages:
- `client/src/components/CreateInventoryModal.jsx:58` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:68` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:84` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/ManageShowInventoryModal.jsx:123` - `<input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />`
- `client/src/components/ManageShowInventoryModal.jsx:127` - `<select required value={formData.dept_id} onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">`
- `client/src/components/ManageShowInventoryModal.jsx:136` - `<textarea required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>`

### `fixed inset-0 z-50 flex items-center justify-center p-4`
- Why review/group this: Modal shell pattern repeated across multiple overlays; good candidate for a shared modal wrapper class/component.
- Usage summary: **5** uses across **5** files
- All usages:
- `client/src/components/CreateOrgModal.jsx:29` - `className="fixed inset-0 z-50 flex items-center justify-center p-4"`
- `client/src/components/CreateShowModal.jsx:37` - `className="fixed inset-0 z-50 flex items-center justify-center p-4"`
- `client/src/components/EditOrgModal.jsx:30` - `className="fixed inset-0 z-50 flex items-center justify-center p-4"`
- `client/src/components/InviteMemberModal.jsx:40` - `className="fixed inset-0 z-50 flex items-center justify-center p-4"`
- `client/src/components/OrgRoleModal.jsx:56` - `className="fixed inset-0 z-50 flex items-center justify-center p-4"`

### `mb-4 rounded bg-red-50 p-3 text-sm text-red-600`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **5** uses across **5** files
- All usages:
- `client/src/components/CreateEventModal.jsx:124` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/CreateOrgEventModal.jsx:124` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/ManageEventModal.jsx:149` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/ManageOrgEventModal.jsx:128` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/ManageShowInventoryModal.jsx:86` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`

### `mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **5** uses across **5** files
- All usages:
- `client/src/pages/OrgInventory.jsx:97` - `<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">`
- `client/src/pages/OrgOverview.jsx:109` - `<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">`
- `client/src/pages/OrgSchedule.jsx:59` - `<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">`
- `client/src/pages/ShowInventory.jsx:83` - `<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">`
- `client/src/pages/ShowSchedule.jsx:59` - `<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">`

### `text-2xl font-bold text-gray-800`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **5** uses across **5** files
- All usages:
- `client/src/components/CreateEventModal.jsx:105` - `<h2 className="text-2xl font-bold text-gray-800">Create Event</h2>`
- `client/src/components/CreateOrgEventModal.jsx:105` - `<h2 className="text-2xl font-bold text-gray-800">Create Event</h2>`
- `client/src/components/ManageEventModal.jsx:129` - `<h2 className="text-2xl font-bold text-gray-800">Manage Event</h2>`
- `client/src/components/ManageOrgEventModal.jsx:119` - `<h2 className="text-2xl font-bold text-gray-800">Manage Event</h2>`
- `client/src/components/ManageShowInventoryModal.jsx:66` - `<h2 className="text-2xl font-bold text-gray-800">Add to Show Inventory</h2>`

### `text-sm font-medium text-blue-600 hover:underline`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **5** uses across **5** files
- All usages:
- `client/src/pages/OrgInventory.jsx:102` - `<Link to={`/orgs/${orgId}/overview`} className="text-sm font-medium text-blue-600 hover:underline">`
- `client/src/pages/OrgOverview.jsx:178` - `<button onClick={() => setIsFullMembersModalOpen(true)} className="text-sm font-medium text-blue-600 hover:underline">`
- `client/src/pages/OrgSchedule.jsx:65` - `<Link to={`/orgs/${orgId}/overview`} className="text-sm font-medium text-blue-600 hover:underline">&larr; Back to Organization Dashboard</Link>`
- `client/src/pages/ShowInventory.jsx:86` - `<Link to={`/orgs/${orgId}/shows/${showId}`} className="text-sm font-medium text-blue-600 hover:underline">`
- `client/src/pages/ShowSchedule.jsx:76` - `<Link to={`/orgs/${orgId}/shows/${showId}`} className="text-sm font-medium text-blue-600 hover:underline">`

### `text-xs text-gray-500`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **5** uses across **5** files
- All usages:
- `client/src/components/CreateEventModal.jsx:229` - `<div className="text-xs text-gray-500">`
- `client/src/components/CreateOrgEventModal.jsx:187` - `<div className="text-xs text-gray-500">{member.assignedRoles?.map((role) => role.name).join(", ")}</div>`
- `client/src/components/ManageEventModal.jsx:209` - `<div className="text-xs text-gray-500">`
- `client/src/components/ManageOrgEventModal.jsx:184` - `<div className="text-xs text-gray-500">{member.assignedRoles?.map((role) => role.name).join(", ")}</div>`
- `client/src/pages/ShowOverview.jsx:223` - `{event.location && <span className="text-xs text-gray-500">📍 {event.location}</span>}`

### `flex flex-wrap gap-3`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/components/CreateEventModal.jsx:210` - `<div className="flex flex-wrap gap-3">`
- `client/src/components/CreateOrgEventModal.jsx:168` - `<div className="flex flex-wrap gap-3">`
- `client/src/components/ManageEventModal.jsx:189` - `<div className="flex flex-wrap gap-3">`
- `client/src/components/ManageOrgEventModal.jsx:165` - `<div className="flex flex-wrap gap-3">`

### `flex justify-end space-x-3`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/components/CreateOrgModal.jsx:43` - `<div className="flex justify-end space-x-3">`
- `client/src/components/CreateShowModal.jsx:84` - `<div className="flex justify-end space-x-3">`
- `client/src/components/EditOrgModal.jsx:43` - `<div className="flex justify-end space-x-3">`
- `client/src/components/InviteMemberModal.jsx:55` - `<div className="flex justify-end space-x-3">`

### `mb-4 flex items-center justify-between`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/components/CreateEventModal.jsx:104` - `<div className="mb-4 flex items-center justify-between">`
- `client/src/components/CreateOrgEventModal.jsx:104` - `<div className="mb-4 flex items-center justify-between">`
- `client/src/components/ManageOrgEventModal.jsx:118` - `<div className="mb-4 flex items-center justify-between">`
- `client/src/components/ui/DashboardSection.jsx:16` - `<div className="mb-4 flex items-center justify-between">`

### `mb-6 flex items-center justify-between`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/pages/OrgInventory.jsx:100` - `<div className="mb-6 flex items-center justify-between">`
- `client/src/pages/OrgSchedule.jsx:63` - `<div className="mb-6 flex items-center justify-between">`
- `client/src/pages/ShowInventory.jsx:84` - `<div className="mb-6 flex items-center justify-between">`
- `client/src/pages/ShowSchedule.jsx:74` - `<div className="mb-6 flex items-center justify-between">`

### `mt-1 text-3xl font-bold text-gray-900`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/pages/OrgInventory.jsx:105` - `<h1 className="mt-1 text-3xl font-bold text-gray-900">Global Inventory Stock</h1>`
- `client/src/pages/OrgSchedule.jsx:66` - `<h1 className="mt-1 text-3xl font-bold text-gray-900">Organization Schedule</h1>`
- `client/src/pages/ShowInventory.jsx:89` - `<h1 className="mt-1 text-3xl font-bold text-gray-900">Show Inventory</h1>`
- `client/src/pages/ShowSchedule.jsx:79` - `<h1 className="mt-1 text-3xl font-bold text-gray-900">Show Schedule</h1>`

### `px-6 py-4`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:161` - `<td className="px-6 py-4">`
- `client/src/pages/OrgInventory.jsx:166` - `<td className="px-6 py-4">{item.description}</td>`
- `client/src/pages/ShowInventory.jsx:132` - `<td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">{item.Department?.name || "Unknown"}</span></td>`
- `client/src/pages/ShowInventory.jsx:133` - `<td className="px-6 py-4">`

### `space-y-6`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/components/CreateEventModal.jsx:204` - `<div className="space-y-6">`
- `client/src/components/CreateOrgEventModal.jsx:162` - `<div className="space-y-6">`
- `client/src/components/ManageEventModal.jsx:182` - `<div className="space-y-6">`
- `client/src/components/ManageOrgEventModal.jsx:159` - `<div className="space-y-6">`

### `text-sm font-medium`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/components/CreateEventModal.jsx:228` - `<div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>`
- `client/src/components/CreateOrgEventModal.jsx:186` - `<div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>`
- `client/src/components/ManageEventModal.jsx:208` - `<div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>`
- `client/src/components/ManageOrgEventModal.jsx:183` - `<div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>`

### `text-sm text-gray-600`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/components/CreateEventModal.jsx:205` - `<p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>`
- `client/src/components/CreateOrgEventModal.jsx:163` - `<p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>`
- `client/src/components/ManageEventModal.jsx:183` - `<p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>`
- `client/src/components/ManageOrgEventModal.jsx:160` - `<p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>`

### `w-full max-w-md rounded-lg bg-white p-6 shadow-xl`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **4** uses across **4** files
- All usages:
- `client/src/components/CreateOrgModal.jsx:32` - `<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/CreateShowModal.jsx:40` - `<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/EditOrgModal.jsx:33` - `<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/InviteMemberModal.jsx:43` - `<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">`

### `cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **1** files
- All usages:
- `client/src/App.jsx:65` - `className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"`
- `client/src/App.jsx:71` - `className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"`
- `client/src/App.jsx:80` - `className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"`

### `flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:212` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`
- `client/src/components/CreateOrgEventModal.jsx:170` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`
- `client/src/components/ManageOrgEventModal.jsx:167` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`

### `flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-blue-50`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:225` - `<label key={member.users_id} className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-blue-50">`
- `client/src/components/CreateOrgEventModal.jsx:183` - `<label key={member.users_id} className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-blue-50">`
- `client/src/components/ManageOrgEventModal.jsx:180` - `<label key={member.users_id} className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-blue-50">`

### `flex h-[calc(100vh-9rem)] items-center justify-center`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/pages/OrgInventory.jsx:87` - `<div className="flex h-[calc(100vh-9rem)] items-center justify-center">`
- `client/src/pages/OrgOverview.jsx:95` - `<div className="flex h-[calc(100vh-9rem)] items-center justify-center">`
- `client/src/pages/ShowOverview.jsx:58` - `<div className="flex h-[calc(100vh-9rem)] items-center justify-center">`

### `flex h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/pages/OrgSchedule.jsx:55` - `return <div className="flex h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">Loading Schedule...</div>;`
- `client/src/pages/ShowInventory.jsx:79` - `return <div className="flex h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">Loading Show Inventory...</div>;`
- `client/src/pages/ShowSchedule.jsx:55` - `return <div className="flex h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">Loading Schedule...</div>;`

### `grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:223` - `<div className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">`
- `client/src/components/CreateOrgEventModal.jsx:181` - `<div className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">`
- `client/src/components/ManageOrgEventModal.jsx:178` - `<div className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">`

### `mb-1 block font-medium text-gray-700 text-sm`
- Why review/group this: Form label typography pattern is repeated; centralizing this avoids label inconsistency.
- Usage summary: **3** uses across **1** files
- All usages:
- `client/src/components/CreateShowModal.jsx:44` - `<label className="mb-1 block font-medium text-gray-700 text-sm">`
- `client/src/components/CreateShowModal.jsx:59` - `<label className="mb-1 block font-medium text-gray-700 text-sm">`
- `client/src/components/CreateShowModal.jsx:71` - `<label className="mb-1 block font-medium text-gray-700 text-sm">`

### `mb-4 flex border-b border-gray-200`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:109` - `<div className="mb-4 flex border-b border-gray-200">`
- `client/src/components/CreateOrgEventModal.jsx:109` - `<div className="mb-4 flex border-b border-gray-200">`
- `client/src/components/ManageOrgEventModal.jsx:123` - `<div className="mb-4 flex border-b border-gray-200">`

### `mb-4 font-bold text-lg`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateOrgModal.jsx:33` - `<h3 className="mb-4 font-bold text-lg">Create New Organization</h3>`
- `client/src/components/EditOrgModal.jsx:34` - `<h3 className="mb-4 font-bold text-lg">Edit Organization</h3>`
- `client/src/components/InviteMemberModal.jsx:44` - `<h3 className="mb-4 font-bold text-lg">Invite New Member</h3>`

### `mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateOrgModal.jsx:38` - `className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/components/EditOrgModal.jsx:38` - `className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/components/InviteMemberModal.jsx:50` - `className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"`

### `mt-1 text-sm text-gray-500`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/ui/shows/ShowCard.jsx:15` - `<p className="mt-1 text-sm text-gray-500">`
- `client/src/pages/OrgSchedule.jsx:97` - `<div className="mt-1 text-sm text-gray-500">`
- `client/src/pages/ShowSchedule.jsx:113` - `<div className="mt-1 text-sm text-gray-500">`

### `p-4 font-semibold`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **1** files
- All usages:
- `client/src/components/FullMembersModal.jsx:60` - `<th className="p-4 font-semibold">Name</th>`
- `client/src/components/FullMembersModal.jsx:61` - `<th className="p-4 font-semibold">Email</th>`
- `client/src/components/FullMembersModal.jsx:62` - `<th className="p-4 font-semibold">Roles</th>`

### `px-6 py-4 font-bold text-gray-900`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **1** files
- All usages:
- `client/src/components/ManageShowMembersModal.jsx:94` - `<th className="px-6 py-4 font-bold text-gray-900">Name</th>`
- `client/src/components/ManageShowMembersModal.jsx:95` - `<th className="px-6 py-4 font-bold text-gray-900">Email</th>`
- `client/src/components/ManageShowMembersModal.jsx:96` - `<th className="px-6 py-4 font-bold text-gray-900">Roles</th>`

### `px-6 py-4 font-medium text-gray-900`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/ManageShowMembersModal.jsx:103` - `<td className="px-6 py-4 font-medium text-gray-900">`
- `client/src/pages/OrgInventory.jsx:160` - `<td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>`
- `client/src/pages/ShowInventory.jsx:131` - `<td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>`

### `text-sm font-medium capitalize`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:214` - `<span className="text-sm font-medium capitalize">{role}</span>`
- `client/src/components/CreateOrgEventModal.jsx:172` - `<span className="text-sm font-medium capitalize">{role}</span>`
- `client/src/components/ManageOrgEventModal.jsx:169` - `<span className="text-sm font-medium capitalize">{role}</span>`

### `text-xl font-bold text-gray-400 hover:text-gray-600`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:106` - `<button onClick={onClose} className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>`
- `client/src/components/CreateOrgEventModal.jsx:106` - `<button onClick={onClose} className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>`
- `client/src/components/ManageOrgEventModal.jsx:120` - `<button onClick={onClose} className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>`

### `w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **3** uses across **3** files
- All usages:
- `client/src/components/CreateEventModal.jsx:103` - `<div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/ManageEventModal.jsx:127` - `<div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/ManageShowInventoryModal.jsx:64` - `<div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">`

### `w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500`
- Why review/group this: Form input baseline styling is repeated; a shared input class/primitive would reduce drift.
- Usage summary: **3** uses across **1** files
- All usages:
- `client/src/components/CreateShowModal.jsx:49` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:64` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:76` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`

### `bg-gray-50 text-gray-700`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:148` - `<thead className="bg-gray-50 text-gray-700">`
- `client/src/pages/ShowInventory.jsx:120` - `<thead className="bg-gray-50 text-gray-700">`

### `cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **1** files
- All usages:
- `client/src/pages/OrgDashboard.jsx:99` - `className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"`
- `client/src/pages/OrgDashboard.jsx:127` - `className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"`

### `divide-y divide-gray-100`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:156` - `<tbody className="divide-y divide-gray-100">`
- `client/src/pages/ShowInventory.jsx:128` - `<tbody className="divide-y divide-gray-100">`

### `fixed inset-0 z-40 flex items-center justify-center p-4`
- Why review/group this: Modal shell pattern repeated across multiple overlays; good candidate for a shared modal wrapper class/component.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/FullMembersModal.jsx:33` - `className="fixed inset-0 z-40 flex items-center justify-center p-4"`
- `client/src/components/ManageShowMembersModal.jsx:48` - `<div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>`

### `flex border-b border-gray-200 mb-4`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/ManageEventModal.jsx:134` - `<div className="flex border-b border-gray-200 mb-4">`
- `client/src/components/ManageShowInventoryModal.jsx:71` - `<div className="flex border-b border-gray-200 mb-4">`

### `flex flex-wrap gap-1`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/FullMembersModal.jsx:74` - `<div className="flex flex-wrap gap-1">`
- `client/src/components/ManageShowMembersModal.jsx:109` - `<div className="flex flex-wrap gap-1">`

### `flex gap-3`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/ManageEventModal.jsx:227` - `<div className="flex gap-3">`
- `client/src/components/ManageOrgEventModal.jsx:196` - `<div className="flex gap-3">`

### `flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **1** files
- All usages:
- `client/src/pages/OrgOverview.jsx:129` - `<Link to={`/orgs/${orgId}/inventory`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgOverview.jsx:132` - `<Link to={`/orgs/${orgId}/scheduling`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`

### `flex items-center space-x-2 capitalize`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/OrgRoleModal.jsx:65` - `className="flex items-center space-x-2 capitalize"`
- `client/src/components/ShowRoleModal.jsx:49` - `<label key={role} className="flex items-center space-x-2 capitalize">`

### `flex items-start gap-4`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgSchedule.jsx:79` - `<div className="flex items-start gap-4">`
- `client/src/pages/ShowSchedule.jsx:96` - `<div className="flex items-start gap-4">`

### `flex justify-between items-center mb-4`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/ManageEventModal.jsx:128` - `<div className="flex justify-between items-center mb-4">`
- `client/src/components/ManageShowInventoryModal.jsx:65` - `<div className="flex justify-between items-center mb-4">`

### `flex justify-end gap-2`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/OrgRoleModal.jsx:77` - `<div className="flex justify-end gap-2">`
- `client/src/components/ShowRoleModal.jsx:60` - `<div className="flex justify-end gap-2">`

### `flex justify-end space-x-3 p-4`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/FullMembersModal.jsx:85` - `<td className="flex justify-end space-x-3 p-4">`
- `client/src/components/ManageShowMembersModal.jsx:117` - `<td className="flex justify-end space-x-3 p-4">`

### `flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/CreateOrgEventModal.jsx:103` - `<div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/ManageOrgEventModal.jsx:117` - `<div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl">`

### `flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`
- Why review/group this: Form input baseline styling is repeated; a shared input class/primitive would reduce drift.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:131` - `className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/pages/ShowInventory.jsx:111` - `<input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />`

### `font-bold text-2xl text-gray-800`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/ManageShowMembersModal.jsx:55` - `<h2 className="font-bold text-2xl text-gray-800">Manage Show Roster</h2>`
- `client/src/components/ui/DashboardSection.jsx:17` - `<h2 className="font-bold text-2xl text-gray-800">`

### `font-bold text-gray-900 text-lg`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/ui/shows/ShowCard.jsx:12` - `<h3 className="font-bold text-gray-900 text-lg">`
- `client/src/pages/ShowSchedule.jsx:105` - `<h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>`

### `font-medium text-blue-600 hover:text-blue-800`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/FullMembersModal.jsx:92` - `className="font-medium text-blue-600 hover:text-blue-800"`
- `client/src/components/ManageShowMembersModal.jsx:121` - `className="font-medium text-blue-600 hover:text-blue-800"`

### `font-medium text-red-600 hover:text-red-800`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/FullMembersModal.jsx:99` - `className="font-medium text-red-600 hover:text-red-800"`
- `client/src/components/ManageShowMembersModal.jsx:128` - `className="font-medium text-red-600 hover:text-red-800"`

### `font-semibold text-gray-500 text-xl`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgOverview.jsx:96` - `<div className="font-semibold text-gray-500 text-xl">`
- `client/src/pages/ShowOverview.jsx:59` - `<div className="font-semibold text-gray-500 text-xl">`

### `font-semibold text-gray-800 mb-3`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **1** files
- All usages:
- `client/src/components/ManageEventModal.jsx:188` - `<h3 className="font-semibold text-gray-800 mb-3">Assign by Role</h3>`
- `client/src/components/ManageEventModal.jsx:202` - `<h3 className="font-semibold text-gray-800 mb-3">Assign Specific Individuals</h3>`

### `form-checkbox h-5 w-5 cursor-pointer text-blue-600`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/OrgRoleModal.jsx:71` - `className="form-checkbox h-5 w-5 cursor-pointer text-blue-600"`
- `client/src/components/ShowRoleModal.jsx:54` - `className="form-checkbox h-5 w-5 cursor-pointer text-blue-600"`

### `grid grid-cols-1 gap-4 sm:grid-cols-3`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/CreateEventModal.jsx:141` - `<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">`
- `client/src/components/CreateOrgEventModal.jsx:134` - `<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">`

### `grid grid-cols-2 gap-4`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/ManageEventModal.jsx:159` - `<div className="grid grid-cols-2 gap-4">`
- `client/src/components/ManageOrgEventModal.jsx:137` - `<div className="grid grid-cols-2 gap-4">`

### `h-4 w-4 text-blue-600 rounded`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **1** files
- All usages:
- `client/src/components/ManageEventModal.jsx:192` - `<input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 text-blue-600 rounded" />`
- `client/src/components/ManageEventModal.jsx:206` - `<input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 text-blue-600 rounded" />`

### `hover:bg-gray-50 transition-colors`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:159` - `<tr key={item.id} className="hover:bg-gray-50 transition-colors">`
- `client/src/pages/ShowInventory.jsx:130` - `<tr key={item.id} className="hover:bg-gray-50 transition-colors">`

### `mb-4 font-bold`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/OrgRoleModal.jsx:60` - `<h3 className="mb-4 font-bold">Manage Roles for {user.User.fname}</h3>`
- `client/src/components/ShowRoleModal.jsx:46` - `<h3 className="mb-4 font-bold">Manage Roles for {user.User?.fname}</h3>`

### `mb-4 text-center text-red-500`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/Login.jsx:30` - `{error && <p className="mb-4 text-center text-red-500">{error}</p>}`
- `client/src/pages/Signup.jsx:40` - `{error && <p className="mb-4 text-center text-red-500">{error}</p>}`

### `mb-6 flex flex-col gap-4 sm:flex-row`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:125` - `<div className="mb-6 flex flex-col gap-4 sm:flex-row">`
- `client/src/pages/ShowInventory.jsx:110` - `<div className="mb-6 flex flex-col gap-4 sm:flex-row">`

### `mb-6 space-y-2`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/OrgRoleModal.jsx:61` - `<div className="mb-6 space-y-2">`
- `client/src/components/ShowRoleModal.jsx:47` - `<div className="mb-6 space-y-2">`

### `mb-6 text-center font-bold text-2xl`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/Login.jsx:29` - `<h2 className="mb-6 text-center font-bold text-2xl">Login</h2>`
- `client/src/pages/Signup.jsx:39` - `<h2 className="mb-6 text-center font-bold text-2xl">Create Account</h2>`

### `mr-3`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgSchedule.jsx:98` - `{event.location && <span className="mr-3">Location: {event.location}</span>}`
- `client/src/pages/ShowSchedule.jsx:114` - `{event.location && <span className="mr-3">📍 {event.location}</span>}`

### `mt-4 sm:mt-0`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgSchedule.jsx:106` - `<div className="mt-4 sm:mt-0">`
- `client/src/pages/ShowSchedule.jsx:123` - `<div className="mt-4 sm:mt-0">`

### `mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/CreateEventModal.jsx:241` - `<div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">`
- `client/src/components/CreateOrgEventModal.jsx:197` - `<div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">`

### `overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:146` - `<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">`
- `client/src/pages/ShowInventory.jsx:118` - `<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">`

### `px-6 py-4 font-semibold text-right`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:153` - `<th className="px-6 py-4 font-semibold text-right">Actions</th>`
- `client/src/pages/ShowInventory.jsx:125` - `<th className="px-6 py-4 font-semibold text-right">Actions</th>`

### `px-6 py-4 text-gray-500`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **1** files
- All usages:
- `client/src/components/ManageShowMembersModal.jsx:107` - `<td className="px-6 py-4 text-gray-500">{m.User?.email}</td>`
- `client/src/components/ManageShowMembersModal.jsx:108` - `<td className="px-6 py-4 text-gray-500">`

### `px-6 py-4 text-right`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:167` - `<td className="px-6 py-4 text-right">`
- `client/src/pages/ShowInventory.jsx:139` - `<td className="px-6 py-4 text-right">`

### `px-6 py-8 text-center italic text-gray-500`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:183` - `<td colSpan="4" className="px-6 py-8 text-center italic text-gray-500">`
- `client/src/pages/ShowInventory.jsx:147` - `)) : <tr><td colSpan="4" className="px-6 py-8 text-center italic text-gray-500">No inventory items assigned to this show.</td></tr>}`

### `rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700`
- Why review/group this: Primary action button styling is repeated; this can be centralized into a reusable button variant.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/EditOrgModal.jsx:54` - `className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"`
- `client/src/components/ShowRoleModal.jsx:62` - `<button onClick={handleSave} disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">`

### `rounded px-4 py-2 text-gray-600 hover:bg-gray-100`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/InviteMemberModal.jsx:59` - `className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100"`
- `client/src/components/ShowRoleModal.jsx:61` - `<button onClick={onClose} disabled={loading} className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>`

### `rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:162` - `<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">`
- `client/src/pages/ShowInventory.jsx:132` - `<td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">{item.Department?.name || "Unknown"}</span></td>`

### `rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:opacity-50`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/ManageEventModal.jsx:235` - `<button type="button" onClick={handleSaveAssignments} disabled={isLoading} className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:opacity-50">`
- `client/src/components/ManageOrgEventModal.jsx:201` - `<button type="button" onClick={handleSaveAssignments} disabled={isLoading} className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:opacity-50">{isLoading ? "Updating..." : "Update Assignments"}</button>`

### `rounded-lg bg-white p-8 shadow-md`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/Login.jsx:28` - `<div className="rounded-lg bg-white p-8 shadow-md">`
- `client/src/pages/Signup.jsx:38` - `<div className="rounded-lg bg-white p-8 shadow-md">`

### `rounded-lg bg-white p-8 text-center shadow-md`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **1** files
- All usages:
- `client/src/pages/OrgDashboard.jsx:135` - `<div className="rounded-lg bg-white p-8 text-center shadow-md">`
- `client/src/pages/OrgDashboard.jsx:159` - `<div className="rounded-lg bg-white p-8 text-center shadow-md">`

### `rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64`
- Why review/group this: Form input baseline styling is repeated; a shared input class/primitive would reduce drift.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:136` - `className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"`
- `client/src/pages/ShowInventory.jsx:112` - `<select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64">`

### `space-y-3`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgOverview.jsx:165` - `<ul className="space-y-3">`
- `client/src/pages/ShowOverview.jsx:267` - `<ul className="space-y-3">`

### `text-gray-400 hover:text-gray-600 text-xl font-bold`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/ManageEventModal.jsx:130` - `<button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>`
- `client/src/components/ManageShowInventoryModal.jsx:67` - `<button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>`

### `text-gray-400 italic text-xs`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:176` - `<span className="text-gray-400 italic text-xs">View Only</span>`
- `client/src/pages/ShowInventory.jsx:143` - `<span className="text-gray-400 italic text-xs">View Only</span>`

### `text-gray-600`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **1** files
- All usages:
- `client/src/pages/ShowOverview.jsx:244` - `<span className="text-gray-600">Spent: ${budgetSpent}</span>`
- `client/src/pages/ShowOverview.jsx:245` - `<span className="text-gray-600">Total: ${budgetTotal}</span>`

### `text-gray-600 text-lg`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **1** files
- All usages:
- `client/src/pages/OrgDashboard.jsx:136` - `<p className="text-gray-600 text-lg">`
- `client/src/pages/OrgDashboard.jsx:160` - `<p className="text-gray-600 text-lg">`

### `text-lg font-extrabold`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgSchedule.jsx:82` - `<span className="text-lg font-extrabold">{start.date.split(" ")[2]}</span>`
- `client/src/pages/ShowSchedule.jsx:100` - `<span className="text-lg font-extrabold">{start.date.split(' ')[2]}</span>`

### `text-red-600 hover:text-red-800 font-medium transition-colors`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:171` - `className="text-red-600 hover:text-red-800 font-medium transition-colors"`
- `client/src/pages/ShowInventory.jsx:141` - `<button onClick={() => handleRemove(item.id, item.name, item.is_global)} className="text-red-600 hover:text-red-800 font-medium transition-colors">Remove</button>`

### `text-xs font-bold uppercase tracking-wider`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgSchedule.jsx:81` - `<span className="text-xs font-bold uppercase tracking-wider">{start.date.split(",")[0]}</span>`
- `client/src/pages/ShowSchedule.jsx:99` - `<span className="text-xs font-bold uppercase tracking-wider">{start.date.split(',')[0]}</span>`

### `w-80 rounded-lg bg-white p-6 shadow-xl`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/OrgRoleModal.jsx:59` - `<div className="w-80 rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/ShowRoleModal.jsx:45` - `<div className="w-80 rounded-lg bg-white p-6 shadow-xl">`

### `w-full max-w-md`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/Login.jsx:27` - `<div className="w-full max-w-md">`
- `client/src/pages/Signup.jsx:37` - `<div className="w-full max-w-md">`

### `w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/Login.jsx:50` - `className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"`
- `client/src/pages/Signup.jsx:82` - `className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"`

### `w-full text-left text-sm`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/components/FullMembersModal.jsx:57` - `<table className="w-full text-left text-sm">`
- `client/src/components/ManageShowMembersModal.jsx:91` - `<table className="w-full text-left text-sm">`

### `w-full text-left text-sm text-gray-600`
- Why review/group this: Repeated pattern; review for extraction if this represents a stable design primitive.
- Usage summary: **2** uses across **2** files
- All usages:
- `client/src/pages/OrgInventory.jsx:147` - `<table className="w-full text-left text-sm text-gray-600">`
- `client/src/pages/ShowInventory.jsx:119` - `<table className="w-full text-left text-sm text-gray-600">`

## 2) Repeated colours to consider grouping into shared variables

These are repeated color values that appear in multiple files and multiple utility types, making them strong candidates for shared tokens/variables.

Found **13** repeated colour groups.

### `blue-500`
- Why review/group this: Brand-accent color reused across interactive UI; tokenizing helps global brand updates.
- Usage summary: **64** uses across **18** files and **3** utility types
- Utility types: `bg, border, ring`
- All usages:
- `client/src/components/CreateEventModal.jsx:137` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:150` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:161` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:172` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:184` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:196` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:58` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:58` - `focus:ring-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:68` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:68` - `focus:ring-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:84` - `focus:border-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:84` - `focus:ring-blue-500` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateOrgEventModal.jsx:131` - `focus:border-blue-500` - `<input id="create-org-event-title" type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:137` - `focus:border-blue-500` - `<input id="create-org-event-date" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:141` - `focus:border-blue-500` - `<input id="create-org-event-start-time" type="time" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:145` - `focus:border-blue-500` - `<input id="create-org-event-end-time" type="time" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:151` - `focus:border-blue-500` - `<input id="create-org-event-location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" placeholder="Optional" />`
- `client/src/components/CreateOrgEventModal.jsx:156` - `focus:border-blue-500` - `<textarea id="create-org-event-description" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" placeholder="Optional notes..."></textarea>`
- `client/src/components/CreateOrgModal.jsx:38` - `focus:ring-blue-500` - `className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:49` - `focus:border-blue-500` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:49` - `focus:ring-blue-500` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:64` - `focus:border-blue-500` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:64` - `focus:ring-blue-500` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:76` - `focus:border-blue-500` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:76` - `focus:ring-blue-500` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/EditOrgModal.jsx:38` - `focus:ring-blue-500` - `className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/components/InviteMemberModal.jsx:50` - `focus:ring-blue-500` - `className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/components/ManageEventModal.jsx:157` - `focus:border-blue-500` - `<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:162` - `focus:border-blue-500` - `<input type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:166` - `focus:border-blue-500` - `<input type="datetime-local" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:171` - `focus:border-blue-500` - `<input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:175` - `focus:border-blue-500` - `<textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"></textarea>`
- `client/src/components/ManageOrgEventModal.jsx:135` - `focus:border-blue-500` - `<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:140` - `focus:border-blue-500` - `<input type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:144` - `focus:border-blue-500` - `<input type="datetime-local" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:149` - `focus:border-blue-500` - `<input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:153` - `focus:border-blue-500` - `<textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"></textarea>`
- `client/src/components/ManageShowInventoryModal.jsx:123` - `focus:border-blue-500` - `<input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />`
- `client/src/components/ManageShowInventoryModal.jsx:123` - `focus:ring-blue-500` - `<input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />`
- `client/src/components/ManageShowInventoryModal.jsx:127` - `focus:border-blue-500` - `<select required value={formData.dept_id} onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">`
- `client/src/components/ManageShowInventoryModal.jsx:127` - `focus:ring-blue-500` - `<select required value={formData.dept_id} onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">`
- `client/src/components/ManageShowInventoryModal.jsx:136` - `focus:border-blue-500` - `<textarea required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>`
- `client/src/components/ManageShowInventoryModal.jsx:136` - `focus:ring-blue-500` - `<textarea required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>`
- `client/src/components/ManageShowMembersModal.jsx:65` - `focus:ring-blue-500` - `className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/components/ui/shows/ShowCard.jsx:10` - `focus:ring-blue-500` - `className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 hover:shadow-md"`
- `client/src/pages/Landing.jsx:28` - `bg-blue-500` - `className="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"`
- `client/src/pages/Login.jsx:37` - `focus:ring-blue-500` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Login.jsx:45` - `focus:ring-blue-500` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Login.jsx:50` - `bg-blue-500` - `className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"`
- `client/src/pages/OrgDashboard.jsx:147` - `focus:ring-blue-500` - `className="group block rounded-lg border border-transparent bg-white p-6 shadow-md transition-all duration-200 hover:border-blue-300 hover:shadow-lg focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/OrgInventory.jsx:131` - `focus:border-blue-500` - `className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/pages/OrgInventory.jsx:131` - `focus:ring-blue-500` - `className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/pages/OrgInventory.jsx:136` - `focus:border-blue-500` - `className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"`
- `client/src/pages/OrgInventory.jsx:136` - `focus:ring-blue-500` - `className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"`
- `client/src/pages/ShowInventory.jsx:111` - `focus:border-blue-500` - `<input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />`
- `client/src/pages/ShowInventory.jsx:111` - `focus:ring-blue-500` - `<input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />`
- `client/src/pages/ShowInventory.jsx:112` - `focus:border-blue-500` - `<select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64">`
- `client/src/pages/ShowInventory.jsx:112` - `focus:ring-blue-500` - `<select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64">`
- `client/src/pages/Signup.jsx:46` - `focus:ring-blue-500` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:53` - `focus:ring-blue-500` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:61` - `focus:ring-blue-500` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:69` - `focus:ring-blue-500` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:77` - `focus:ring-blue-500` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:82` - `bg-blue-500` - `className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"`

### `white`
- Why review/group this: Repeated in interaction states; tokenizing helps coordinated hover/focus behavior updates.
- Usage summary: **59** uses across **26** files and **2** utility types
- Utility types: `bg, text`
- All usages:
- `client/src/App.jsx:48` - `text-white` - `<nav className="bg-blue-600 text-white shadow-lg">`
- `client/src/App.jsx:167` - `text-white` - `<footer className="bg-gray-800 text-white">`
- `client/src/components/CreateEventModal.jsx:103` - `bg-white` - `<div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/CreateEventModal.jsx:243` - `text-white` - `<button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/CreateInventoryModal.jsx:40` - `bg-white` - `<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/CreateInventoryModal.jsx:99` - `text-white` - `className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"`
- `client/src/components/CreateOrgEventModal.jsx:103` - `bg-white` - `<div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/CreateOrgEventModal.jsx:199` - `text-white` - `<button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/CreateOrgModal.jsx:32` - `bg-white` - `<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/CreateOrgModal.jsx:54` - `text-white` - `className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"`
- `client/src/components/CreateShowModal.jsx:40` - `bg-white` - `<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/CreateShowModal.jsx:95` - `text-white` - `className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"`
- `client/src/components/EditOrgModal.jsx:33` - `bg-white` - `<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/EditOrgModal.jsx:54` - `text-white` - `className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"`
- `client/src/components/FullMembersModal.jsx:45` - `bg-white` - `<div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/InviteMemberModal.jsx:43` - `bg-white` - `<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/InviteMemberModal.jsx:66` - `text-white` - `className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"`
- `client/src/components/ManageEventModal.jsx:127` - `bg-white` - `<div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/ManageEventModal.jsx:231` - `text-white` - `<button type="submit" form="update-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/ManageEventModal.jsx:235` - `text-white` - `<button type="button" onClick={handleSaveAssignments} disabled={isLoading} className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:opacity-50">`
- `client/src/components/ManageOrgEventModal.jsx:117` - `bg-white` - `<div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/ManageOrgEventModal.jsx:199` - `text-white` - `<button type="submit" form="update-org-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">{isLoading ? "Saving..." : "Save Details"}</button>`
- `client/src/components/ManageOrgEventModal.jsx:201` - `text-white` - `<button type="button" onClick={handleSaveAssignments} disabled={isLoading} className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:opacity-50">{isLoading ? "Updating..." : "Update Assignments"}</button>`
- `client/src/components/ManageShowInventoryModal.jsx:64` - `bg-white` - `<div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">`
- `client/src/components/ManageShowInventoryModal.jsx:147` - `text-white` - `<button type="submit" form="create-item-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/ManageShowMembersModal.jsx:53` - `bg-white` - `<div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl relative">`
- `client/src/components/ManageShowMembersModal.jsx:65` - `bg-white` - `className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/components/ManageShowMembersModal.jsx:75` - `text-white` - `className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"`
- `client/src/components/ManageShowMembersModal.jsx:83` - `text-white` - `className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors whitespace-nowrap"`
- `client/src/components/ManageShowMembersModal.jsx:100` - `bg-white` - `<tbody className="divide-y divide-gray-200 bg-white">`
- `client/src/components/OrgRoleModal.jsx:59` - `bg-white` - `<div className="w-80 rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/OrgRoleModal.jsx:89` - `text-white` - `className="cursor-pointer rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"`
- `client/src/components/ShowRoleModal.jsx:45` - `bg-white` - `<div className="w-80 rounded-lg bg-white p-6 shadow-xl">`
- `client/src/components/ShowRoleModal.jsx:62` - `text-white` - `<button onClick={handleSave} disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">`
- `client/src/components/ui/shows/ShowCard.jsx:10` - `bg-white` - `className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 hover:shadow-md"`
- `client/src/pages/Landing.jsx:12` - `text-white` - `<div className="mx-auto max-w-4xl px-6 text-center text-white sm:px-10">`
- `client/src/pages/Landing.jsx:28` - `text-white` - `className="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"`
- `client/src/pages/Landing.jsx:34` - `text-white` - `className="rounded-md border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"`
- `client/src/pages/Landing.jsx:42` - `text-white` - `className="rounded-md bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"`
- `client/src/pages/Login.jsx:28` - `bg-white` - `<div className="rounded-lg bg-white p-8 shadow-md">`
- `client/src/pages/Login.jsx:50` - `text-white` - `className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"`
- `client/src/pages/OrgDashboard.jsx:99` - `text-white` - `className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"`
- `client/src/pages/OrgDashboard.jsx:108` - `bg-white` - `className="cursor-pointer rounded border border-red-600 bg-white px-4 py-2 text-red-600 hover:bg-red-50"`
- `client/src/pages/OrgDashboard.jsx:127` - `text-white` - `className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"`
- `client/src/pages/OrgDashboard.jsx:135` - `bg-white` - `<div className="rounded-lg bg-white p-8 text-center shadow-md">`
- `client/src/pages/OrgDashboard.jsx:147` - `bg-white` - `className="group block rounded-lg border border-transparent bg-white p-6 shadow-md transition-all duration-200 hover:border-blue-300 hover:shadow-lg focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/OrgDashboard.jsx:159` - `bg-white` - `<div className="rounded-lg bg-white p-8 text-center shadow-md">`
- `client/src/pages/OrgInventory.jsx:146` - `bg-white` - `<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">`
- `client/src/pages/OrgOverview.jsx:117` - `bg-white` - `<div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">`
- `client/src/pages/OrgOverview.jsx:129` - `bg-white` - `<Link to={`/orgs/${orgId}/inventory`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgOverview.jsx:132` - `bg-white` - `<Link to={`/orgs/${orgId}/scheduling`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgSchedule.jsx:78` - `bg-white` - `<div key={event.id} className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow sm:flex-row sm:items-center">`
- `client/src/pages/ShowInventory.jsx:118` - `bg-white` - `<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">`
- `client/src/pages/ShowOverview.jsx:139` - `bg-white` - `<aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">`
- `client/src/pages/ShowOverview.jsx:140` - `text-white` - `<div className="bg-gray-800 p-6 text-white">`
- `client/src/pages/ShowOverview.jsx:217` - `bg-white` - `<li key={event.id} className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">`
- `client/src/pages/ShowSchedule.jsx:95` - `bg-white` - `<div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow">`
- `client/src/pages/Signup.jsx:38` - `bg-white` - `<div className="rounded-lg bg-white p-8 shadow-md">`
- `client/src/pages/Signup.jsx:82` - `text-white` - `className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"`

### `gray-300`
- Why review/group this: Neutral UI system color reused for structure/typography; tokenizing helps consistent surfaces and text contrast.
- Usage summary: **47** uses across **14** files and **3** utility types
- Utility types: `border, ring, text`
- All usages:
- `client/src/App.jsx:170` - `text-gray-300` - `<p className="text-gray-300 text-sm">`
- `client/src/components/CreateEventModal.jsx:137` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:150` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:161` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:172` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:184` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateEventModal.jsx:196` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:58` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:68` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateInventoryModal.jsx:84` - `border-gray-300` - `className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/components/CreateOrgEventModal.jsx:131` - `border-gray-300` - `<input id="create-org-event-title" type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:137` - `border-gray-300` - `<input id="create-org-event-date" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:141` - `border-gray-300` - `<input id="create-org-event-start-time" type="time" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:145` - `border-gray-300` - `<input id="create-org-event-end-time" type="time" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/CreateOrgEventModal.jsx:151` - `border-gray-300` - `<input id="create-org-event-location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" placeholder="Optional" />`
- `client/src/components/CreateOrgEventModal.jsx:156` - `border-gray-300` - `<textarea id="create-org-event-description" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" placeholder="Optional notes..."></textarea>`
- `client/src/components/CreateShowModal.jsx:49` - `border-gray-300` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:64` - `border-gray-300` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/CreateShowModal.jsx:76` - `border-gray-300` - `className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"`
- `client/src/components/ManageEventModal.jsx:157` - `border-gray-300` - `<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:162` - `border-gray-300` - `<input type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:166` - `border-gray-300` - `<input type="datetime-local" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:171` - `border-gray-300` - `<input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageEventModal.jsx:175` - `border-gray-300` - `<textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"></textarea>`
- `client/src/components/ManageOrgEventModal.jsx:135` - `border-gray-300` - `<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:140` - `border-gray-300` - `<input type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:144` - `border-gray-300` - `<input type="datetime-local" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:149` - `border-gray-300` - `<input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />`
- `client/src/components/ManageOrgEventModal.jsx:153` - `border-gray-300` - `<textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"></textarea>`
- `client/src/components/ManageShowInventoryModal.jsx:123` - `border-gray-300` - `<input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />`
- `client/src/components/ManageShowInventoryModal.jsx:127` - `border-gray-300` - `<select required value={formData.dept_id} onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">`
- `client/src/components/ManageShowInventoryModal.jsx:136` - `border-gray-300` - `<textarea required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>`
- `client/src/components/ManageShowMembersModal.jsx:65` - `border-gray-300` - `className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Login.jsx:37` - `border-gray-300` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Login.jsx:45` - `border-gray-300` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/OrgInventory.jsx:131` - `border-gray-300` - `className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"`
- `client/src/pages/OrgInventory.jsx:136` - `border-gray-300` - `className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"`
- `client/src/pages/OrgOverview.jsx:129` - `ring-gray-300` - `<Link to={`/orgs/${orgId}/inventory`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgOverview.jsx:132` - `ring-gray-300` - `<Link to={`/orgs/${orgId}/scheduling`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgOverview.jsx:150` - `border-gray-300` - `<div className="col-span-full flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">`
- `client/src/pages/ShowInventory.jsx:111` - `border-gray-300` - `<input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />`
- `client/src/pages/ShowInventory.jsx:112` - `border-gray-300` - `<select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64">`
- `client/src/pages/Signup.jsx:46` - `border-gray-300` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:53` - `border-gray-300` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:61` - `border-gray-300` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:69` - `border-gray-300` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
- `client/src/pages/Signup.jsx:77` - `border-gray-300` - `className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`

### `gray-700`
- Why review/group this: Neutral UI system color reused for structure/typography; tokenizing helps consistent surfaces and text contrast.
- Usage summary: **42** uses across **16** files and **2** utility types
- Utility types: `border, text`
- All usages:
- `client/src/App.jsx:169` - `border-gray-700` - `<div className="mt-4 mb-4 border-gray-700 text-center">`
- `client/src/components/CreateEventModal.jsx:130` - `text-gray-700` - `<label htmlFor="create-event-title" className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>`
- `client/src/components/CreateEventModal.jsx:143` - `text-gray-700` - `<label htmlFor="create-event-date" className="mb-1 block text-sm font-medium text-gray-700">Date</label>`
- `client/src/components/CreateEventModal.jsx:154` - `text-gray-700` - `<label htmlFor="create-event-start-time" className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>`
- `client/src/components/CreateEventModal.jsx:165` - `text-gray-700` - `<label htmlFor="create-event-end-time" className="mb-1 block text-sm font-medium text-gray-700">End Time</label>`
- `client/src/components/CreateEventModal.jsx:178` - `text-gray-700` - `<label htmlFor="create-event-location" className="mb-1 block text-sm font-medium text-gray-700">Location</label>`
- `client/src/components/CreateEventModal.jsx:190` - `text-gray-700` - `<label htmlFor="create-event-description" className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>`
- `client/src/components/CreateInventoryModal.jsx:52` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>`
- `client/src/components/CreateInventoryModal.jsx:63` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Department</label>`
- `client/src/components/CreateInventoryModal.jsx:78` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Description</label>`
- `client/src/components/CreateOrgEventModal.jsx:130` - `text-gray-700` - `<label htmlFor="create-org-event-title" className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>`
- `client/src/components/CreateOrgEventModal.jsx:136` - `text-gray-700` - `<label htmlFor="create-org-event-date" className="mb-1 block text-sm font-medium text-gray-700">Date</label>`
- `client/src/components/CreateOrgEventModal.jsx:140` - `text-gray-700` - `<label htmlFor="create-org-event-start-time" className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>`
- `client/src/components/CreateOrgEventModal.jsx:144` - `text-gray-700` - `<label htmlFor="create-org-event-end-time" className="mb-1 block text-sm font-medium text-gray-700">End Time</label>`
- `client/src/components/CreateOrgEventModal.jsx:150` - `text-gray-700` - `<label htmlFor="create-org-event-location" className="mb-1 block text-sm font-medium text-gray-700">Location</label>`
- `client/src/components/CreateOrgEventModal.jsx:155` - `text-gray-700` - `<label htmlFor="create-org-event-description" className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>`
- `client/src/components/CreateShowModal.jsx:44` - `text-gray-700` - `<label className="mb-1 block font-medium text-gray-700 text-sm">`
- `client/src/components/CreateShowModal.jsx:59` - `text-gray-700` - `<label className="mb-1 block font-medium text-gray-700 text-sm">`
- `client/src/components/CreateShowModal.jsx:71` - `text-gray-700` - `<label className="mb-1 block font-medium text-gray-700 text-sm">`
- `client/src/components/FullMembersModal.jsx:58` - `text-gray-700` - `<thead className="border-b bg-gray-50 text-gray-700">`
- `client/src/components/ManageEventModal.jsx:156` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>`
- `client/src/components/ManageEventModal.jsx:161` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>`
- `client/src/components/ManageEventModal.jsx:165` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>`
- `client/src/components/ManageEventModal.jsx:170` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Location</label>`
- `client/src/components/ManageEventModal.jsx:174` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>`
- `client/src/components/ManageOrgEventModal.jsx:134` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>`
- `client/src/components/ManageOrgEventModal.jsx:139` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>`
- `client/src/components/ManageOrgEventModal.jsx:143` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>`
- `client/src/components/ManageOrgEventModal.jsx:148` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Location</label>`
- `client/src/components/ManageOrgEventModal.jsx:152` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>`
- `client/src/components/ManageShowInventoryModal.jsx:122` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>`
- `client/src/components/ManageShowInventoryModal.jsx:126` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Department</label>`
- `client/src/components/ManageShowInventoryModal.jsx:135` - `text-gray-700` - `<label className="mb-1 block text-sm font-medium text-gray-700">Description</label>`
- `client/src/components/OrgRoleModal.jsx:81` - `hover:text-gray-700` - `className="cursor-pointer text-gray-500 hover:text-gray-700"`
- `client/src/pages/OrgInventory.jsx:148` - `text-gray-700` - `<thead className="bg-gray-50 text-gray-700">`
- `client/src/pages/OrgOverview.jsx:129` - `text-gray-700` - `<Link to={`/orgs/${orgId}/inventory`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgOverview.jsx:132` - `text-gray-700` - `<Link to={`/orgs/${orgId}/scheduling`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgSchedule.jsx:107` - `text-gray-700` - `<button onClick={() => setSelectedEvent(event)} className="rounded bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200">Manage</button>`
- `client/src/pages/ShowInventory.jsx:120` - `text-gray-700` - `<thead className="bg-gray-50 text-gray-700">`
- `client/src/pages/ShowOverview.jsx:151` - `text-gray-700` - `className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"`
- `client/src/pages/ShowOverview.jsx:211` - `text-gray-700` - `<h4 className="text-sm font-bold text-gray-700 mb-2 border-b border-gray-200 pb-2 sticky top-0 bg-gray-50 pt-2">`
- `client/src/pages/ShowSchedule.jsx:128` - `text-gray-700` - `className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"`

### `blue-600`
- Why review/group this: Brand-accent color reused across interactive UI; tokenizing helps global brand updates.
- Usage summary: **40** uses across **25** files and **2** utility types
- Utility types: `bg, text`
- All usages:
- `client/src/App.jsx:48` - `bg-blue-600` - `<nav className="bg-blue-600 text-white shadow-lg">`
- `client/src/components/CreateEventModal.jsx:213` - `text-blue-600` - `<input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/CreateEventModal.jsx:226` - `text-blue-600` - `<input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/CreateEventModal.jsx:243` - `bg-blue-600` - `<button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/CreateInventoryModal.jsx:99` - `bg-blue-600` - `className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"`
- `client/src/components/CreateOrgEventModal.jsx:171` - `text-blue-600` - `<input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/CreateOrgEventModal.jsx:184` - `text-blue-600` - `<input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/CreateOrgEventModal.jsx:199` - `bg-blue-600` - `<button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/CreateOrgModal.jsx:54` - `bg-blue-600` - `className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"`
- `client/src/components/CreateShowModal.jsx:95` - `bg-blue-600` - `className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"`
- `client/src/components/EditOrgModal.jsx:54` - `bg-blue-600` - `className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"`
- `client/src/components/FullMembersModal.jsx:92` - `text-blue-600` - `className="font-medium text-blue-600 hover:text-blue-800"`
- `client/src/components/InviteMemberModal.jsx:66` - `bg-blue-600` - `className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"`
- `client/src/components/ManageEventModal.jsx:192` - `text-blue-600` - `<input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 text-blue-600 rounded" />`
- `client/src/components/ManageEventModal.jsx:206` - `text-blue-600` - `<input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 text-blue-600 rounded" />`
- `client/src/components/ManageEventModal.jsx:231` - `bg-blue-600` - `<button type="submit" form="update-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/ManageOrgEventModal.jsx:168` - `text-blue-600` - `<input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/ManageOrgEventModal.jsx:181` - `text-blue-600` - `<input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 rounded text-blue-600" />`
- `client/src/components/ManageOrgEventModal.jsx:199` - `bg-blue-600` - `<button type="submit" form="update-org-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">{isLoading ? "Saving..." : "Save Details"}</button>`
- `client/src/components/ManageShowInventoryModal.jsx:147` - `bg-blue-600` - `<button type="submit" form="create-item-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/ManageShowMembersModal.jsx:75` - `bg-blue-600` - `className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"`
- `client/src/components/ManageShowMembersModal.jsx:121` - `text-blue-600` - `className="font-medium text-blue-600 hover:text-blue-800"`
- `client/src/components/OrgRoleModal.jsx:71` - `text-blue-600` - `className="form-checkbox h-5 w-5 cursor-pointer text-blue-600"`
- `client/src/components/OrgRoleModal.jsx:89` - `bg-blue-600` - `className="cursor-pointer rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"`
- `client/src/components/ShowRoleModal.jsx:54` - `text-blue-600` - `className="form-checkbox h-5 w-5 cursor-pointer text-blue-600"`
- `client/src/components/ShowRoleModal.jsx:62` - `bg-blue-600` - `<button onClick={handleSave} disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">`
- `client/src/components/ui/DashboardSection.jsx:21` - `hover:text-blue-600` - `className="cursor-pointer rounded outline-none transition-colors hover:text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500"`
- `client/src/pages/Landing.jsx:28` - `hover:bg-blue-600` - `className="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"`
- `client/src/pages/Login.jsx:50` - `hover:bg-blue-600` - `className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"`
- `client/src/pages/OrgInventory.jsx:102` - `text-blue-600` - `<Link to={`/orgs/${orgId}/overview`} className="text-sm font-medium text-blue-600 hover:underline">`
- `client/src/pages/OrgOverview.jsx:129` - `hover:text-blue-600` - `<Link to={`/orgs/${orgId}/inventory`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgOverview.jsx:132` - `hover:text-blue-600` - `<Link to={`/orgs/${orgId}/scheduling`} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600">`
- `client/src/pages/OrgOverview.jsx:178` - `text-blue-600` - `<button onClick={() => setIsFullMembersModalOpen(true)} className="text-sm font-medium text-blue-600 hover:underline">`
- `client/src/pages/OrgSchedule.jsx:65` - `text-blue-600` - `<Link to={`/orgs/${orgId}/overview`} className="text-sm font-medium text-blue-600 hover:underline">&larr; Back to Organization Dashboard</Link>`
- `client/src/pages/OrgSchedule.jsx:92` - `text-blue-600` - `<p className="text-sm font-semibold uppercase tracking-tight text-blue-600">`
- `client/src/pages/ShowInventory.jsx:86` - `text-blue-600` - `<Link to={`/orgs/${orgId}/shows/${showId}`} className="text-sm font-medium text-blue-600 hover:underline">`
- `client/src/pages/ShowOverview.jsx:220` - `text-blue-600` - `<span className="text-xs font-medium text-blue-600">`
- `client/src/pages/ShowSchedule.jsx:76` - `text-blue-600` - `<Link to={`/orgs/${orgId}/shows/${showId}`} className="text-sm font-medium text-blue-600 hover:underline">`
- `client/src/pages/ShowSchedule.jsx:106` - `text-blue-600` - `<p className="text-sm font-semibold text-blue-600 uppercase tracking-tight">`
- `client/src/pages/Signup.jsx:82` - `hover:bg-blue-600` - `className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"`

### `gray-200`
- Why review/group this: Neutral UI system color reused for structure/typography; tokenizing helps consistent surfaces and text contrast.
- Usage summary: **38** uses across **16** files and **5** utility types
- Utility types: `bg, border, divide, ring, text`
- All usages:
- `client/src/components/CreateEventModal.jsx:109` - `border-gray-200` - `<div className="mb-4 flex border-b border-gray-200">`
- `client/src/components/CreateEventModal.jsx:208` - `border-gray-200` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/CreateEventModal.jsx:212` - `border-gray-200` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`
- `client/src/components/CreateEventModal.jsx:221` - `border-gray-200` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/CreateOrgEventModal.jsx:109` - `border-gray-200` - `<div className="mb-4 flex border-b border-gray-200">`
- `client/src/components/CreateOrgEventModal.jsx:166` - `border-gray-200` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/CreateOrgEventModal.jsx:170` - `border-gray-200` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`
- `client/src/components/CreateOrgEventModal.jsx:179` - `border-gray-200` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/FullMembersModal.jsx:66` - `divide-gray-200` - `<tbody className="divide-y divide-gray-200">`
- `client/src/components/ManageEventModal.jsx:134` - `border-gray-200` - `<div className="flex border-b border-gray-200 mb-4">`
- `client/src/components/ManageEventModal.jsx:187` - `border-gray-200` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/ManageEventModal.jsx:191` - `border-gray-200` - `<label key={role} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded border border-gray-200 hover:bg-gray-100">`
- `client/src/components/ManageEventModal.jsx:201` - `border-gray-200` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/ManageOrgEventModal.jsx:123` - `border-gray-200` - `<div className="mb-4 flex border-b border-gray-200">`
- `client/src/components/ManageOrgEventModal.jsx:163` - `border-gray-200` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/ManageOrgEventModal.jsx:167` - `border-gray-200` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`
- `client/src/components/ManageOrgEventModal.jsx:176` - `border-gray-200` - `<div className="rounded-lg border border-gray-200 p-4">`
- `client/src/components/ManageShowInventoryModal.jsx:71` - `border-gray-200` - `<div className="flex border-b border-gray-200 mb-4">`
- `client/src/components/ManageShowInventoryModal.jsx:94` - `border-gray-200` - `<div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">`
- `client/src/components/ManageShowMembersModal.jsx:60` - `border-gray-200` - `<div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">`
- `client/src/components/ManageShowMembersModal.jsx:90` - `border-gray-200` - `<div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">`
- `client/src/components/ManageShowMembersModal.jsx:100` - `divide-gray-200` - `<tbody className="divide-y divide-gray-200 bg-white">`
- `client/src/components/ui/DashboardSection.jsx:42` - `border-gray-200` - `<div className="min-h-75 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-6">`
- `client/src/components/ui/organizations/OrgHeader.jsx:5` - `border-gray-200` - `<header className="flex items-start justify-between border-gray-200 border-b bg-gray-50 px-8 py-6">`
- `client/src/pages/Landing.jsx:19` - `text-gray-200` - `<p className="mx-auto mt-6 max-w-2xl text-base text-gray-200 sm:text-lg">`
- `client/src/pages/OrgInventory.jsx:146` - `border-gray-200` - `<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">`
- `client/src/pages/OrgOverview.jsx:117` - `ring-gray-200` - `<div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">`
- `client/src/pages/OrgSchedule.jsx:78` - `border-gray-200` - `<div key={event.id} className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow sm:flex-row sm:items-center">`
- `client/src/pages/OrgSchedule.jsx:107` - `hover:bg-gray-200` - `<button onClick={() => setSelectedEvent(event)} className="rounded bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200">Manage</button>`
- `client/src/pages/ShowInventory.jsx:118` - `border-gray-200` - `<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">`
- `client/src/pages/ShowOverview.jsx:139` - `ring-gray-200` - `<aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">`
- `client/src/pages/ShowOverview.jsx:202` - `bg-gray-200` - `<div className="grid grid-cols-7 gap-px mb-2 bg-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-sm">`
- `client/src/pages/ShowOverview.jsx:202` - `border-gray-200` - `<div className="grid grid-cols-7 gap-px mb-2 bg-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-sm">`
- `client/src/pages/ShowOverview.jsx:211` - `border-gray-200` - `<h4 className="text-sm font-bold text-gray-700 mb-2 border-b border-gray-200 pb-2 sticky top-0 bg-gray-50 pt-2">`
- `client/src/pages/ShowOverview.jsx:217` - `border-gray-200` - `<li key={event.id} className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">`
- `client/src/pages/ShowOverview.jsx:247` - `bg-gray-200` - `<div className="h-2.5 w-full rounded-full bg-gray-200">`
- `client/src/pages/ShowSchedule.jsx:95` - `border-gray-200` - `<div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow">`
- `client/src/pages/ShowSchedule.jsx:128` - `hover:bg-gray-200` - `className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"`

### `gray-100`
- Why review/group this: Neutral UI system color reused for structure/typography; tokenizing helps consistent surfaces and text contrast.
- Usage summary: **24** uses across **15** files and **3** utility types
- Utility types: `bg, border, divide`
- All usages:
- `client/src/components/CreateEventModal.jsx:212` - `hover:bg-gray-100` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`
- `client/src/components/CreateEventModal.jsx:241` - `border-gray-100` - `<div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">`
- `client/src/components/CreateEventModal.jsx:242` - `hover:bg-gray-100` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>`
- `client/src/components/CreateInventoryModal.jsx:92` - `hover:bg-gray-100` - `className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100"`
- `client/src/components/CreateOrgEventModal.jsx:170` - `hover:bg-gray-100` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`
- `client/src/components/CreateOrgEventModal.jsx:197` - `border-gray-100` - `<div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">`
- `client/src/components/CreateOrgEventModal.jsx:198` - `hover:bg-gray-100` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>`
- `client/src/components/CreateShowModal.jsx:88` - `hover:bg-gray-100` - `className="cursor-pointer rounded px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"`
- `client/src/components/InviteMemberModal.jsx:59` - `hover:bg-gray-100` - `className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100"`
- `client/src/components/ManageEventModal.jsx:191` - `hover:bg-gray-100` - `<label key={role} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded border border-gray-200 hover:bg-gray-100">`
- `client/src/components/ManageEventModal.jsx:222` - `border-gray-100` - `<div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">`
- `client/src/components/ManageEventModal.jsx:228` - `hover:bg-gray-100` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Done</button>`
- `client/src/components/ManageOrgEventModal.jsx:167` - `hover:bg-gray-100` - `<label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">`
- `client/src/components/ManageOrgEventModal.jsx:194` - `border-gray-100` - `<div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">`
- `client/src/components/ManageOrgEventModal.jsx:197` - `hover:bg-gray-100` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Done</button>`
- `client/src/components/ManageShowInventoryModal.jsx:145` - `border-gray-100` - `<div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">`
- `client/src/components/ManageShowInventoryModal.jsx:146` - `hover:bg-gray-100` - `<button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>`
- `client/src/components/ShowRoleModal.jsx:61` - `hover:bg-gray-100` - `<button onClick={onClose} disabled={loading} className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>`
- `client/src/components/ui/shows/ShowCard.jsx:10` - `border-gray-100` - `className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 hover:shadow-md"`
- `client/src/pages/OrgInventory.jsx:156` - `divide-gray-100` - `<tbody className="divide-y divide-gray-100">`
- `client/src/pages/OrgOverview.jsx:128` - `border-gray-100` - `<div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50/50 px-8 py-4">`
- `client/src/pages/OrgSchedule.jsx:107` - `bg-gray-100` - `<button onClick={() => setSelectedEvent(event)} className="rounded bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200">Manage</button>`
- `client/src/pages/ShowInventory.jsx:128` - `divide-gray-100` - `<tbody className="divide-y divide-gray-100">`
- `client/src/pages/ShowSchedule.jsx:128` - `bg-gray-100` - `className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"`

### `gray-800`
- Why review/group this: Neutral UI system color reused for structure/typography; tokenizing helps consistent surfaces and text contrast.
- Usage summary: **24** uses across **14** files and **2** utility types
- Utility types: `bg, text`
- All usages:
- `client/src/App.jsx:167` - `bg-gray-800` - `<footer className="bg-gray-800 text-white">`
- `client/src/components/CreateEventModal.jsx:105` - `text-gray-800` - `<h2 className="text-2xl font-bold text-gray-800">Create Event</h2>`
- `client/src/components/CreateEventModal.jsx:209` - `text-gray-800` - `<h3 className="mb-3 font-semibold text-gray-800">Assign by Role</h3>`
- `client/src/components/CreateEventModal.jsx:222` - `text-gray-800` - `<h3 className="mb-3 font-semibold text-gray-800">Assign Specific Individuals</h3>`
- `client/src/components/CreateInventoryModal.jsx:41` - `text-gray-800` - `<h2 className="mb-4 text-2xl font-bold text-gray-800">Add Global Inventory Item</h2>`
- `client/src/components/CreateOrgEventModal.jsx:105` - `text-gray-800` - `<h2 className="text-2xl font-bold text-gray-800">Create Event</h2>`
- `client/src/components/CreateOrgEventModal.jsx:167` - `text-gray-800` - `<h3 className="mb-3 font-semibold text-gray-800">Assign by Role</h3>`
- `client/src/components/CreateOrgEventModal.jsx:180` - `text-gray-800` - `<h3 className="mb-3 font-semibold text-gray-800">Assign Specific Individuals</h3>`
- `client/src/components/CreateOrgModal.jsx:47` - `hover:text-gray-800` - `className="cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800"`
- `client/src/components/FullMembersModal.jsx:49` - `hover:text-gray-800` - `className="absolute top-4 right-4 font-bold text-gray-500 text-xl hover:text-gray-800"`
- `client/src/components/ManageEventModal.jsx:129` - `text-gray-800` - `<h2 className="text-2xl font-bold text-gray-800">Manage Event</h2>`
- `client/src/components/ManageEventModal.jsx:188` - `text-gray-800` - `<h3 className="font-semibold text-gray-800 mb-3">Assign by Role</h3>`
- `client/src/components/ManageEventModal.jsx:202` - `text-gray-800` - `<h3 className="font-semibold text-gray-800 mb-3">Assign Specific Individuals</h3>`
- `client/src/components/ManageOrgEventModal.jsx:119` - `text-gray-800` - `<h2 className="text-2xl font-bold text-gray-800">Manage Event</h2>`
- `client/src/components/ManageOrgEventModal.jsx:164` - `text-gray-800` - `<h3 className="mb-3 font-semibold text-gray-800">Assign by Role</h3>`
- `client/src/components/ManageOrgEventModal.jsx:177` - `text-gray-800` - `<h3 className="mb-3 font-semibold text-gray-800">Assign Specific Individuals</h3>`
- `client/src/components/ManageShowInventoryModal.jsx:66` - `text-gray-800` - `<h2 className="text-2xl font-bold text-gray-800">Add to Show Inventory</h2>`
- `client/src/components/ManageShowInventoryModal.jsx:96` - `text-gray-800` - `<div className="font-semibold text-gray-800">{item.name}</div>`
- `client/src/components/ManageShowMembersModal.jsx:55` - `text-gray-800` - `<h2 className="font-bold text-2xl text-gray-800">Manage Show Roster</h2>`
- `client/src/components/ui/DashboardSection.jsx:17` - `text-gray-800` - `<h2 className="font-bold text-2xl text-gray-800">`
- `client/src/components/ui/organizations/OrgHeader.jsx:11` - `text-gray-800` - `President: <span className="text-gray-800">{presidentName}</span>`
- `client/src/pages/OrgDashboard.jsx:150` - `text-gray-800` - `<h3 className="font-semibold text-gray-800 text-xl transition-colors group-hover:text-blue-600">`
- `client/src/pages/ShowOverview.jsx:140` - `bg-gray-800` - `<div className="bg-gray-800 p-6 text-white">`
- `client/src/pages/ShowOverview.jsx:187` - `text-gray-800` - `<h3 className="font-bold text-gray-800 text-lg">`

### `blue-700`
- Why review/group this: Brand-accent color reused across interactive UI; tokenizing helps global brand updates.
- Usage summary: **23** uses across **19** files and **2** utility types
- Utility types: `bg, text`
- All usages:
- `client/src/App.jsx:65` - `hover:bg-blue-700` - `className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"`
- `client/src/App.jsx:71` - `hover:bg-blue-700` - `className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"`
- `client/src/App.jsx:80` - `hover:bg-blue-700` - `className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"`
- `client/src/components/CreateEventModal.jsx:243` - `hover:bg-blue-700` - `<button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/CreateInventoryModal.jsx:99` - `hover:bg-blue-700` - `className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"`
- `client/src/components/CreateOrgEventModal.jsx:199` - `hover:bg-blue-700` - `<button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/CreateOrgModal.jsx:54` - `hover:bg-blue-700` - `className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"`
- `client/src/components/CreateShowModal.jsx:95` - `hover:bg-blue-700` - `className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"`
- `client/src/components/EditOrgModal.jsx:54` - `hover:bg-blue-700` - `className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"`
- `client/src/components/InviteMemberModal.jsx:66` - `hover:bg-blue-700` - `className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"`
- `client/src/components/ManageEventModal.jsx:231` - `hover:bg-blue-700` - `<button type="submit" form="update-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/ManageOrgEventModal.jsx:199` - `hover:bg-blue-700` - `<button type="submit" form="update-org-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">{isLoading ? "Saving..." : "Save Details"}</button>`
- `client/src/components/ManageShowInventoryModal.jsx:101` - `text-blue-700` - `className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition-colors"`
- `client/src/components/ManageShowInventoryModal.jsx:147` - `hover:bg-blue-700` - `<button type="submit" form="create-item-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">`
- `client/src/components/ManageShowMembersModal.jsx:75` - `hover:bg-blue-700` - `className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"`
- `client/src/components/OrgRoleModal.jsx:89` - `hover:bg-blue-700` - `className="cursor-pointer rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"`
- `client/src/components/ShowRoleModal.jsx:62` - `hover:bg-blue-700` - `<button onClick={handleSave} disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">`
- `client/src/pages/OrgInventory.jsx:162` - `text-blue-700` - `<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">`
- `client/src/pages/OrgSchedule.jsx:80` - `text-blue-700` - `<div className="flex min-w-16 flex-col items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-700">`
- `client/src/pages/ShowInventory.jsx:132` - `text-blue-700` - `<td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">{item.Department?.name || "Unknown"}</span></td>`
- `client/src/pages/ShowOverview.jsx:102` - `text-blue-700` - `<div key={i} className="truncate text-[10px] leading-tight px-1 py-0.5 rounded bg-blue-100 text-blue-700 font-medium w-full text-left" title={e.title}>`
- `client/src/pages/ShowOverview.jsx:151` - `hover:text-blue-700` - `className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"`
- `client/src/pages/ShowSchedule.jsx:98` - `text-blue-700` - `<div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg p-2 min-w-16 border border-blue-100">`

### `red-600`
- Why review/group this: Error/destructive color reused in alerts/actions; tokenizing helps keep severity semantics aligned.
- Usage summary: **18** uses across **12** files and **3** utility types
- Utility types: `bg, border, text`
- All usages:
- `client/src/App.jsx:87` - `hover:bg-red-600` - `className="cursor-pointer rounded-md bg-red-500 px-3 py-2 font-medium text-sm transition hover:bg-red-600"`
- `client/src/components/CreateEventModal.jsx:124` - `text-red-600` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/CreateInventoryModal.jsx:44` - `text-red-600` - `<div className="mb-4 rounded bg-red-50 p-4 text-red-600">`
- `client/src/components/CreateInventoryModal.jsx:49` - `text-red-600` - `{error && <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/CreateOrgEventModal.jsx:124` - `text-red-600` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/FullMembersModal.jsx:99` - `text-red-600` - `className="font-medium text-red-600 hover:text-red-800"`
- `client/src/components/FullMembersModal.jsx:126` - `hover:text-red-600` - `className="text-gray-500 text-sm hover:text-red-600"`
- `client/src/components/ManageEventModal.jsx:149` - `text-red-600` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/ManageEventModal.jsx:223` - `text-red-600` - `<button type="button" onClick={handleDelete} className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors">`
- `client/src/components/ManageOrgEventModal.jsx:128` - `text-red-600` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/ManageOrgEventModal.jsx:195` - `text-red-600` - `<button type="button" onClick={handleDelete} className="text-sm font-medium text-red-600 transition-colors hover:text-red-800">Delete Event</button>`
- `client/src/components/ManageShowInventoryModal.jsx:86` - `text-red-600` - `{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}`
- `client/src/components/ManageShowInventoryModal.jsx:116` - `text-red-600` - `<div className="rounded bg-red-50 p-4 text-red-600">`
- `client/src/components/ManageShowMembersModal.jsx:128` - `text-red-600` - `className="font-medium text-red-600 hover:text-red-800"`
- `client/src/pages/OrgDashboard.jsx:108` - `border-red-600` - `className="cursor-pointer rounded border border-red-600 bg-white px-4 py-2 text-red-600 hover:bg-red-50"`
- `client/src/pages/OrgDashboard.jsx:108` - `text-red-600` - `className="cursor-pointer rounded border border-red-600 bg-white px-4 py-2 text-red-600 hover:bg-red-50"`
- `client/src/pages/OrgInventory.jsx:171` - `text-red-600` - `className="text-red-600 hover:text-red-800 font-medium transition-colors"`
- `client/src/pages/ShowInventory.jsx:141` - `text-red-600` - `<button onClick={() => handleRemove(item.id, item.name, item.is_global)} className="text-red-600 hover:text-red-800 font-medium transition-colors">Remove</button>`

### `gray-400`
- Why review/group this: Neutral UI system color reused for structure/typography; tokenizing helps consistent surfaces and text contrast.
- Usage summary: **12** uses across **11** files and **2** utility types
- Utility types: `bg, text`
- All usages:
- `client/src/components/CreateEventModal.jsx:106` - `text-gray-400` - `<button onClick={onClose} className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>`
- `client/src/components/CreateOrgEventModal.jsx:106` - `text-gray-400` - `<button onClick={onClose} className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>`
- `client/src/components/CreateShowModal.jsx:95` - `disabled:bg-gray-400` - `className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"`
- `client/src/components/InviteMemberModal.jsx:66` - `disabled:bg-gray-400` - `className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"`
- `client/src/components/ManageEventModal.jsx:130` - `text-gray-400` - `<button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>`
- `client/src/components/ManageOrgEventModal.jsx:120` - `text-gray-400` - `<button onClick={onClose} className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>`
- `client/src/components/ManageShowInventoryModal.jsx:67` - `text-gray-400` - `<button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>`
- `client/src/components/ManageShowMembersModal.jsx:56` - `text-gray-400` - `<button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>`
- `client/src/components/ManageShowMembersModal.jsx:80` - `text-gray-400` - `<div className="text-gray-400 font-medium hidden sm:block">OR</div>`
- `client/src/pages/OrgInventory.jsx:176` - `text-gray-400` - `<span className="text-gray-400 italic text-xs">View Only</span>`
- `client/src/pages/ShowInventory.jsx:143` - `text-gray-400` - `<span className="text-gray-400 italic text-xs">View Only</span>`
- `client/src/pages/ShowOverview.jsx:144` - `text-gray-400` - `<p className="mt-1 text-gray-400 text-sm">Show Dashboard</p>`

### `blue-100`
- Why review/group this: Brand-accent color reused across interactive UI; tokenizing helps global brand updates.
- Usage summary: **8** uses across **8** files and **2** utility types
- Utility types: `bg, border`
- All usages:
- `client/src/components/FullMembersModal.jsx:78` - `bg-blue-100` - `className="rounded bg-blue-100 px-2 py-1 text-blue-800 text-xs"`
- `client/src/components/ManageShowInventoryModal.jsx:101` - `bg-blue-100` - `className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition-colors"`
- `client/src/components/ManageShowMembersModal.jsx:111` - `bg-blue-100` - `<span key={role.id} className="rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs capitalize">`
- `client/src/pages/OrgInventory.jsx:162` - `border-blue-100` - `<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">`
- `client/src/pages/OrgSchedule.jsx:80` - `border-blue-100` - `<div className="flex min-w-16 flex-col items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-700">`
- `client/src/pages/ShowInventory.jsx:132` - `border-blue-100` - `<td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">{item.Department?.name || "Unknown"}</span></td>`
- `client/src/pages/ShowOverview.jsx:102` - `bg-blue-100` - `<div key={i} className="truncate text-[10px] leading-tight px-1 py-0.5 rounded bg-blue-100 text-blue-700 font-medium w-full text-left" title={e.title}>`
- `client/src/pages/ShowSchedule.jsx:98` - `border-blue-100` - `<div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg p-2 min-w-16 border border-blue-100">`

### `red-500`
- Why review/group this: Error/destructive color reused in alerts/actions; tokenizing helps keep severity semantics aligned.
- Usage summary: **4** uses across **4** files and **2** utility types
- Utility types: `bg, text`
- All usages:
- `client/src/App.jsx:87` - `bg-red-500` - `className="cursor-pointer rounded-md bg-red-500 px-3 py-2 font-medium text-sm transition hover:bg-red-600"`
- `client/src/components/InviteMemberModal.jsx:45` - `text-red-500` - `{error && <p className="mb-4 text-red-500 text-sm">{error}</p>}`
- `client/src/pages/Login.jsx:30` - `text-red-500` - `{error && <p className="mb-4 text-center text-red-500">{error}</p>}`
- `client/src/pages/Signup.jsx:40` - `text-red-500` - `{error && <p className="mb-4 text-center text-red-500">{error}</p>}`

## 3) Notes

- Dynamic class composition (template literals, conditional fragments) may hide additional duplicates not captured by string-literal scanning.
- If you want a stricter pass next, I can generate an AST-based audit to include dynamic class assembly patterns.
