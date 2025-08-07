#!/bin/bash

# Script to update @VerifySession({ roles: [...] }) pattern to proper guard usage

echo "Updating controllers to use proper SuperTokens roles guards..."

# Update audit-log controller
sed -i '' 's/@VerifySession({$/@UseGuards(SuperTokensAuthGuard, SuperTokensRolesGuard)\n  @VerifySession()/g' src/api/audit-log/audit-log.controller.ts
sed -i '' 's/roles: \[UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF\],$/@Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF)/g' src/api/audit-log/audit-log.controller.ts
sed -i '' 's/roles: \[UserRole.OWNER, UserRole.ADMIN\],$/@Roles(UserRole.OWNER, UserRole.ADMIN)/g' src/api/audit-log/audit-log.controller.ts
sed -i '' 's/roles: \[UserRole.OWNER\],$/@Roles(UserRole.OWNER)/g' src/api/audit-log/audit-log.controller.ts
sed -i '' 's/  })$/  /g' src/api/audit-log/audit-log.controller.ts

echo "Controllers updated successfully!"