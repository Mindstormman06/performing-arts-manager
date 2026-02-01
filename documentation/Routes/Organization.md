=====================================================
# Performing Arts Manager Organization Routes
=====================================================

 ## GET /api/orgs
 * Get all organizations
 * Query: ?search=name **+**
 * Returns:
    *    200: { organizations: [...] }

 ## GET /api/orgs/:id
 * Get organization by id
 * Returns:
    *   200: { organization: { id, name } }
    *   404: { error: "User not found" }

 ## POST /api/orgs
 * Create new organization
 * Body: { name }
 * Returns:
    *   201: { organization: { id, name } }
    *   400: { error: "Validation error" } **+**

 ## PUT /api/orgs/:id
 * Update organization info
 * Body: { name }
 * Returns:
    *   200: { user: { id, name } }
    *   400: { error: "Validation error" } **+**
    *   404: { error: "Organization not found" }

 ## DELETE /api/orgs/:id
 * Delete organization
 * Returns:
    *   200: { message: "Organization deleted successfully" }
    *   404: { error: "Organization not found" }

 ## POST /api/orgs/:id/join
 * Delete user
 * Body: { userId }
 * Returns:
    *   200: { message: "User added to organization", data: [...] } 
    *   404: Error resource not found.
        * { error: "Organization not found" }
        * { error: "User not found" }
    *   409: { error: "User already in organization" }

 ## PUT /api/orgs/:id/users/:userId/roles
 * Append roles to user
 * Body: { roles }
 * Returns:
    *   200: { data: [...] }
    *   404: Error resource not found.
        * { error: "Organization not found" }
        * { error: "User is not a member of this organization" }

 ## GET /api/orgs/:id/users
 * Get all users in organization
 * Returns:
    *   200: { users: [...] }
    *   404: { error: "Organization not found" }

 ## GET /api/orgs/:id/users/:userId
 * Get organization user by ID
 * Returns:
    *   200: { assignment_id, users_id, org_id, User: [...], assignedRoles: [...] }
    *   404: Error resource not found.
        * { error: "Organization not found" }
        * { error: "User not found in this organization" }

 ## GET /api/orgs/:id/users/search
 * Search organization users by role
 * Query: ?role=role
 * Returns:
    *   200: { users: [...] }
    *   404: Error resource not found.
        * { error: "Organization not found" }
        * { error: "Role not found" }

 ## DELETE /api/orgs/:id/users/:userId/roles
 * Remove roles from user in organization
 * Returns:
    *   200: { message: "role(s) removed successfully" }
    *   404: Error resource not found.
        * { error: "Organization not found" }
        * { error: "Membership or Roles not found" }

 ## DELETE /api/orgs/:id/users/:userId
 * Remove user from organization
 * Returns:
    *   200: { message: "User removed from organization successfully" }
    *   404: Error resource not found.
        * { error: "Organization not found" }
        * { error: "User is not a member of this organization" }


