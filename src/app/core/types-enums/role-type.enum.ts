/**
 * Role Type Constants
 * 
 * These are UI representations of user roles.
 * Backend is the source of truth for role definitions, permissions, and access control.
 * Frontend should not make authorization decisions based on role.
 */
export const ROLE_TYPE = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER'
} as const;

export type RoleType = typeof ROLE_TYPE[keyof typeof ROLE_TYPE];