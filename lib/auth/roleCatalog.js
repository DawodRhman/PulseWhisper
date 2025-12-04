export const ROLE_CATALOG = [
  {
    type: "ADMIN",
    label: "Administrator",
    description: "Full control across every module, operators, and audit logs.",
    permissions: [
      "services:write",
      "tenders:write",
      "careers:write",
      "news:write",
      "projects:write",
      "leadership:write",
      "settings:write",
      "media:write",
      "users:write",
      "audit:read",
      "faq:write",
      "education:write",
      "watertoday:write",
      "rti:write",
      "pages:read",
      "pages:write",
    ],
  },
  {
    type: "EDITOR",
    label: "Content Editor",
    description: "Manages core content such as services, news, leadership, and projects.",
    permissions: [
      "services:write",
      "careers:write",
      "news:write",
      "projects:write",
      "leadership:write",
      "faq:write",
      "education:write",
      "watertoday:write",
      "rti:write",
      "pages:read",
      "pages:write",
    ],
  },
  {
    type: "MEDIA_MANAGER",
    label: "Media Manager",
    description: "Handles uploads, asset metadata, and connected channels.",
    permissions: ["media:write", "settings:write"],
  },
  {
    type: "PROCUREMENT",
    label: "Procurement",
    description: "Owns tenders and procurement status updates.",
    permissions: ["tenders:write"],
  },
  {
    type: "HR",
    label: "Human Resources",
    description: "Maintains careers module and operator onboarding context.",
    permissions: ["careers:write"],
  },
  {
    type: "AUDITOR",
    label: "Auditor",
    description: "Read-only visibility into immutable audit trail entries.",
    permissions: ["audit:read"],
  },
];

export const ROLE_PERMISSIONS_MAP = ROLE_CATALOG.reduce((acc, role) => {
  acc[role.type] = role.permissions;
  return acc;
}, {});
