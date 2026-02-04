=====================================================
# Performing Arts Manager Show Routes
=====================================================

 ## GET /api/shows
 * Get all shows
 * Query: ?search=title
 * Returns:
    *    200: { shows: [...] }

 ## GET /api/shows/:id
 * Get shows by id
 * Returns:
    *   200: { show: { id, title, start_date, end_date, organization_id } }
    *   404: { error: "User not found" }

 ## POST /api/shows
 * Create new show
 * Body: { name }
 * Returns:
    *   201: { organization: { id, title, start_date, end_date, organization_id } }
    *   400: { error: "Validation error" }
    *   404: { error: "Organization not found" }

 ## PUT /api/shows/:id
 * Update organization info
 * Body: { title, start_date, end_date }
 * Returns:
    *   200: { user: { id, title, start_date, end_date, organization_id } }
    *   400: { error: "Validation error" }
    *   404: { error: "Show not found" }

 ## DELETE /api/shows/:id
 * Delete show
 * Returns:
    *   200: { message: "Show deleted successfully" }
    *   404: { error: "Show not found" }

 ## POST /api/shows/:id/join
 * Add user to show
 * Body: { userId }
 * Returns:
    *   200: { message: "User added to show", data: [...] } 
    *   404: Error resource not found.
        * { error: "Show not found" }
        * { error: "User not found" }
    *   409: { error: "User already in show" }

 ## PUT /api/shows/:id/users/:userId/roles
 * Append roles to user
 * Body: { roles }
 * Returns:
    *   200: { data: [...] }
    *   404: Error resource not found.
        * { error: "Show not found" }
        * { error: "User is not a member of this show" }
        * { error: "Role(s) not found" }

 ## GET /api/shows/:id/users
 * Get all users in show
 * Returns:
    *   200: { users: [...] }
    *   404: { error: "Show not found" }

 ## GET /api/shows/:id/users/:userId
 * Get show user by ID
 * Returns:
    *   200: { assignment_id, users_id, show_id, User: [...], assignedRoles: [...] }
    *   404: Error resource not found.
        * { error: "Show not found" }
        * { error: "User not found in this show" }

 ## GET /api/shows/:id/users/search
 * Search show users by role
 * Query: ?role=role
 * Returns:
    *   200: { users: [...] }
    *   404: Error resource not found.
        * { error: "Show not found" }
        * { error: "Role not found" }

 ## DELETE /api/shows/:id/users/:userId/roles
 * Remove roles from user in show
 * Returns:
    *   200: { message: "role(s) removed successfully" }
    *   404: Error resource not found.
        * { error: "Show not found" }
        * { error: "Membership or Roles not found" }
        * { error: "Role(s) not found" }

 ## DELETE /api/shows/:id/users/:userId
 * Remove user from show
 * Returns:
    *   200: { message: "User removed from show successfully" }
    *   404: Error resource not found.
        * { error: "Show not found" }
        * { error: "User is not a member of this show" }


