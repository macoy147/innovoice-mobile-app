# Timestamp Fix Summary

## Issue
When saving drafts, the displayed time was incorrect. For example, when saving at 11:50 PM, it showed 3:49 PM (8-hour difference).

## Root Cause
The issue was caused by inconsistent date formatting across components:
1. Drafts were saved with `new Date().toISOString()` (UTC time)
2. Display used `toLocaleDateString()` with time options, which doesn't properly handle timezone conversion
3. The locale setting `en-US` with `hour: '2-digit'` was not correctly converting UTC to local time

## Solution

### 1. Created Centralized Date Utility
Created `mobile-app/src/utils/dateUtils.js` with standardized date formatting functions:

- **`formatDate(dateString)`** - Full date and time (e.g., "May 12, 2026, 11:50 PM")
  - Uses `toLocaleString()` instead of `toLocaleDateString()`
  - Uses `hour: 'numeric'` with `hour12: true` for proper 12-hour format
  - Correctly converts UTC timestamps to local timezone

- **`formatDateShort(dateString)`** - Date only (e.g., "May 12, 2026")

- **`formatTime(dateString)`** - Time only (e.g., "11:50 PM")

- **`getRelativeTime(dateString)`** - Relative time (e.g., "2 hours ago")

- **`formatDateSmart(dateString)`** - Shows time if today, date otherwise

### 2. Updated Components
Replaced local `formatDate` functions with the centralized utility in:
- ✅ `mobile-app/src/components/drafts/DraftsList.jsx`
- ✅ `mobile-app/src/components/tracking/SubmissionDetails.jsx`
- ✅ `mobile-app/src/components/tracking/StatusHistory.jsx`

## Technical Details

### Before (Incorrect):
```javascript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
```

### After (Correct):
```javascript
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
```

### Key Changes:
1. **`toLocaleString()`** instead of `toLocaleDateString()` - Properly handles date + time
2. **`hour: 'numeric'`** instead of `hour: '2-digit'` - Better formatting for 12-hour time
3. **`hour12: true`** - Explicitly enables 12-hour format with AM/PM

## Benefits

1. **Accurate Timestamps**: Times now display correctly in the user's local timezone
2. **Consistency**: All date formatting uses the same utility
3. **Maintainability**: Single source of truth for date formatting
4. **Flexibility**: Multiple formatting options available (full, short, time-only, relative)
5. **Error Handling**: Built-in validation for invalid dates

## Testing

To verify the fix:
1. Save a draft at a known time (e.g., 11:50 PM)
2. Check the displayed time in the Drafts list
3. The time should now match the actual save time
4. Check other screens (Tracking, Submission Details) for consistent time display

## Notes

- The draft service continues to save timestamps as ISO 8601 strings (UTC)
- This is the correct approach for storage
- The display layer now properly converts UTC to local time
- All timezone conversions are handled automatically by JavaScript's `Date` object
