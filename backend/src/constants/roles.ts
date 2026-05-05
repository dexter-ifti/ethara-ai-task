export const roles = ["admin", "project_manager", "team_member"] as const;

export type Role = (typeof roles)[number];
