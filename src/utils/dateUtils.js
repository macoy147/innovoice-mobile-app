/**
 * Date Utilities
 * Centralized date formatting functions
 */

/**
 * Format a date string to local date and time
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Formatted date string (e.g., "May 12, 2026, 11:50 PM")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format a date string to short format (date only)
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Formatted date string (e.g., "May 12, 2026")
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date string to time only
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Formatted time string (e.g., "11:50 PM")
 */
export const formatTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid time';
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get relative time string (e.g., "2 hours ago", "Just now")
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDateShort(dateString);
  }
};

/**
 * Get current timestamp as ISO string
 * @returns {string} ISO 8601 timestamp
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Check if a date is today
 * @param {string} dateString - ISO 8601 date string
 * @returns {boolean} True if date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Format date for display in lists (shows time if today, date otherwise)
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Formatted string
 */
export const formatDateSmart = (dateString) => {
  if (!dateString) return '';
  
  if (isToday(dateString)) {
    return formatTime(dateString);
  } else {
    return formatDateShort(dateString);
  }
};
