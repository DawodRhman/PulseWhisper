import { ROLE_PERMISSIONS_MAP } from "@/lib/auth/roleCatalog";

const ROLE_PERMISSIONS = ROLE_PERMISSIONS_MAP;

export function derivePermissionsFromRoles(roles = []) {
  const set = new Set();
  roles.forEach((role) => {
    (ROLE_PERMISSIONS[role] || []).forEach((permission) => set.add(permission));
  });
  return Array.from(set);
}

export function hasPermission(permissions = [], permission) {
  return permissions.includes(permission);
}
