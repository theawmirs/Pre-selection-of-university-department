// Constants for notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};

// Default notification duration
export const DEFAULT_DURATION = 3000;

// Create notification object
export const createNotification = (
  message,
  type = NOTIFICATION_TYPES.INFO,
  duration = DEFAULT_DURATION
) => {
  return {
    id: Date.now(),
    message,
    type,
    duration,
  };
};

// Notification styles mapping
export const notificationStyles = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    backgroundColor: "#4caf50",
    color: "#fff",
  },
  [NOTIFICATION_TYPES.ERROR]: {
    backgroundColor: "#f44336",
    color: "#fff",
  },
  [NOTIFICATION_TYPES.INFO]: {
    backgroundColor: "#2196f3",
    color: "#fff",
  },
  [NOTIFICATION_TYPES.WARNING]: {
    backgroundColor: "#ff9800",
    color: "#fff",
  },
};
