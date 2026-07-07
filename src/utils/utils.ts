export const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const MODULES = [
  "clientOrders",
  "dmrOrders",
  "manufacturerOrders",
] as const;
export type MODULES_KEYS = (typeof MODULES)[number];

export const ACTIONS = ["view", "add", "delete", "edit"] as const;
export type MODULE_ACTIONS = (typeof ACTIONS)[number];

export type MODULE_PERMISSIONS = Record<
  MODULES_KEYS,
  Record<MODULE_ACTIONS, boolean>
>;

export const ROLE_PERMISSIONS: Record<string, MODULE_PERMISSIONS> = {
  TRACKER: {
    clientOrders: {
      view: false,
      add: false,
      delete: false,
      edit: false,
    },
    dmrOrders: {
      view: false,
      add: false,
      delete: false,
      edit: false,
    },
    manufacturerOrders: {
      view: false,
      add: false,
      delete: false,
      edit: false,
    },
  },
  TRACKER_VIEW: {
    clientOrders: {
      view: true,
      add: false,
      delete: false,
      edit: false,
    },
    dmrOrders: {
      view: true,
      add: false,
      delete: false,
      edit: false,
    },
    manufacturerOrders: {
      view: true,
      add: false,
      delete: false,
      edit: false,
    },
  },
  TRACKER_EDIT: {
    clientOrders: {
      view: false,
      add: false,
      delete: false,
      edit: true,
    },
    dmrOrders: {
      view: false,
      add: false,
      delete: false,
      edit: true,
    },
    manufacturerOrders: {
      view: false,
      add: false,
      delete: false,
      edit: true,
    },
  },
  TRACKER_ADD: {
    clientOrders: {
      view: false,
      add: true,
      delete: false,
      edit: false,
    },
    dmrOrders: {
      view: false,
      add: true,
      delete: false,
      edit: false,
    },
    manufacturerOrders: {
      view: false,
      add: true,
      delete: false,
      edit: false,
    },
  },
  TRACKER_DELETE: {
    clientOrders: {
      view: false,
      add: true,
      delete: true,
      edit: false,
    },
    dmrOrders: {
      view: false,
      add: true,
      delete: true,
      edit: false,
    },
    manufacturerOrders: {
      view: false,
      add: true,
      delete: true,
      edit: false,
    },
  },
};
