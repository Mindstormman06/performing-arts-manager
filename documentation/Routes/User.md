=====================================================
# Performing Arts Manager User Routes
=====================================================

 ## GET /api/users
 * Get all users
 * Query: ?search=name **+**
 * Returns:
    *    200: { users: [...], total: 100 }

 ## GET /api/users/:id
 * Get user by ID
 * Returns:
    *   200: { user: { id, fname, lname, email, passwordHash, sessionToken, sessionExpiry } }
    *   404: { error: "User not found" }

 ## POST /api/users
 * Create new user
 * Body: { firstName, lastName, email, role }
 * Returns:
    *   201: { user: { id, firstName, lastName, email, passwordHash } }
    *   400: { error: "Validation error" } **+**
    *   409: { error: "Account already exists" } **+**

 ## PUT /api/users/:id
 * Update user info
 * Body: { firstName, lastName, email, role }
 * Returns:
    *   200: { user: { id, firstName, lastName, email, passwordHash } }
    *   400: { error: "Validation error" } **+**
    *   404: { error: "User not found" }

 ## DELETE /api/users/:id
 * Delete user
 * Returns:
    *   200: { message: "User deleted successfully" } 
    *   404: { error: "User not found" } **+**
