/**
 * Application Constants
 * Shared constants used throughout the app
 */

export const CATEGORIES = [
  { value: 'academic', label: 'Academic' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'extracurricular', label: 'Extracurricular' },
  { value: 'general', label: 'General' },
];

export const YEAR_LEVELS = [
  { value: '1st Year', label: '1st Year' },
  { value: '2nd Year', label: '2nd Year' },
  { value: '3rd Year', label: '3rd Year' },
  { value: '4th Year', label: '4th Year' },
];

export const PROGRAMS = [
  { value: 'BSIT', label: 'BSIT' },
  { value: 'BSHM', label: 'BSHM' },
  { value: 'BSIE', label: 'BSIE' },
  { value: 'BSFi', label: 'BSFi' },
  { value: 'BIT - Computer Technology', label: 'BIT - Computer Technology' },
  { value: 'BIT - Automotive', label: 'BIT - Automotive' },
  { value: 'BIT - Electronics', label: 'BIT - Electronics' },
  { value: 'BSED-MATH', label: 'BSED-MATH' },
  { value: 'BEED', label: 'BEED' },
  { value: 'BTLED-HE', label: 'BTLED-HE' },
];

export const STATUSES = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  FORWARDED: 'forwarded',
  ACTION_TAKEN: 'action_taken',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const STATUS_LABELS = {
  [STATUSES.SUBMITTED]: 'Submitted',
  [STATUSES.UNDER_REVIEW]: 'Under Review',
  [STATUSES.FORWARDED]: 'Forwarded',
  [STATUSES.ACTION_TAKEN]: 'Action Taken',
  [STATUSES.RESOLVED]: 'Resolved',
  [STATUSES.REJECTED]: 'Rejected',
};

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Low',
  [PRIORITIES.MEDIUM]: 'Medium',
  [PRIORITIES.HIGH]: 'High',
  [PRIORITIES.URGENT]: 'Urgent',
};

export const TRACKING_CODE_REGEX = /^VISI-[A-Z0-9]{8}-[A-Z0-9]{4}$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
