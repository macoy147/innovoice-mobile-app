/**
 * Validation Utilities
 * Provides validation functions for form inputs and data
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate tracking code format
 * Expected format: VISI-XXXXXXXX-XXXX (8 alphanumeric, then 4 alphanumeric — matches backend/DB)
 * @param {string} trackingCode - Tracking code to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateTrackingCode(trackingCode) {
  if (!trackingCode || trackingCode.trim() === '') {
    return 'Tracking code is required';
  }

  // Tracking code format: VISI-XXXXXXXX-XXXX (where X is alphanumeric; same as constants.js and backend)
  const trackingCodeRegex = /^VISI-[A-Z0-9]{8}-[A-Z0-9]{4}$/i;
  
  if (!trackingCodeRegex.test(trackingCode.trim())) {
    return 'Invalid tracking code format. Expected: VISI-XXXXXXXX-XXXX';
  }

  return null;
}

/**
 * Validate title
 * @param {string} title - Title to validate
 * @param {number} maxLength - Maximum length (default 200)
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateTitle(title, maxLength = 200) {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      error: 'Title is required',
    };
  }

  if (title.length > maxLength) {
    return {
      isValid: false,
      error: `Title must not exceed ${maxLength} characters (current: ${title.length})`,
    };
  }

  if (title.trim().length < 3) {
    return {
      isValid: false,
      error: 'Title must be at least 3 characters long',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate content
 * @param {string} content - Content to validate
 * @param {number} maxLength - Maximum length (default 2000)
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateContent(content, maxLength = 2000) {
  if (!content || content.trim() === '') {
    return {
      isValid: false,
      error: 'Content is required',
    };
  }

  if (content.length > maxLength) {
    return {
      isValid: false,
      error: `Content must not exceed ${maxLength} characters (current: ${content.length})`,
    };
  }

  if (content.trim().length < 10) {
    return {
      isValid: false,
      error: 'Content must be at least 10 characters long',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate year level
 * @param {string} yearLevel - Year level to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateYearLevel(yearLevel) {
  const validYearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  if (!yearLevel || yearLevel.trim() === '') {
    return {
      isValid: false,
      error: 'Year level is required',
    };
  }

  if (!validYearLevels.includes(yearLevel)) {
    return {
      isValid: false,
      error: 'Please select a valid year level',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate category
 * @param {string} category - Category to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateCategory(category) {
  const validCategories = ['academic', 'administrative', 'extracurricular', 'general'];

  if (!category || category.trim() === '') {
    return {
      isValid: false,
      error: 'Category is required',
    };
  }

  if (!validCategories.includes(category)) {
    return {
      isValid: false,
      error: 'Please select a valid category',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate student ID (basic validation)
 * @param {string} studentId - Student ID to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateStudentId(studentId) {
  if (!studentId || studentId.trim() === '') {
    return {
      isValid: false,
      error: 'Student ID is required',
    };
  }

  if (studentId.trim().length < 3) {
    return {
      isValid: false,
      error: 'Please enter a valid student ID',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateName(name) {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Name is required',
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters long',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate contact number (basic validation)
 * @param {string} contactNumber - Contact number to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateContactNumber(contactNumber) {
  if (!contactNumber || contactNumber.trim() === '') {
    return {
      isValid: false,
      error: 'Contact number is required',
    };
  }

  // Remove spaces and dashes for validation
  const cleaned = contactNumber.replace(/[\s-]/g, '');
  
  // Check if it contains only digits and is reasonable length
  if (!/^\d{7,15}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid contact number',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate program
 * @param {string} program - Program to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateProgram(program) {
  if (!program || program.trim() === '') {
    return {
      isValid: false,
      error: 'Program is required',
    };
  }

  if (program.trim().length < 2) {
    return {
      isValid: false,
      error: 'Please select a valid program',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate complete submission form
 * @param {Object} formData - Form data to validate
 * @returns {Object} Errors object (empty if valid)
 */
export function validateSubmissionForm(formData) {
  const errors = {};

  // Validate category
  const categoryValidation = validateCategory(formData.category);
  if (!categoryValidation.isValid) {
    errors.category = categoryValidation.error;
  }

  // Validate title
  const titleValidation = validateTitle(formData.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error;
  }

  // Validate content
  const contentValidation = validateContent(formData.content);
  if (!contentValidation.isValid) {
    errors.content = contentValidation.error;
  }

  // If not anonymous, validate submitter info
  if (!formData.isAnonymous && formData.submitter) {
    const submitter = formData.submitter;

    // Validate name
    const nameValidation = validateName(submitter.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error;
    }

    // Validate student ID
    const studentIdValidation = validateStudentId(submitter.studentId);
    if (!studentIdValidation.isValid) {
      errors.studentId = studentIdValidation.error;
    }

    // Validate email
    const emailValidation = validateEmail(submitter.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    // Validate contact number
    const contactValidation = validateContactNumber(submitter.contactNumber);
    if (!contactValidation.isValid) {
      errors.contactNumber = contactValidation.error;
    }

    // Validate program
    const programValidation = validateProgram(submitter.program);
    if (!programValidation.isValid) {
      errors.program = programValidation.error;
    }

    // Validate year level
    const yearLevelValidation = validateYearLevel(submitter.yearLevel);
    if (!yearLevelValidation.isValid) {
      errors.yearLevel = yearLevelValidation.error;
    }
  }

  return errors;
}

/**
 * Sanitize input to prevent injection attacks
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

/**
 * Check if a string is empty or only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if empty
 */
export function isEmpty(str) {
  return !str || str.trim() === '';
}

/**
 * Get character count with visual feedback
 * @param {string} text - Text to count
 * @param {number} maxLength - Maximum allowed length
 * @returns {Object} { count: number, remaining: number, isOverLimit: boolean }
 */
export function getCharacterCount(text, maxLength) {
  const count = text ? text.length : 0;
  const remaining = maxLength - count;
  const isOverLimit = count > maxLength;

  return {
    count,
    remaining,
    isOverLimit,
  };
}
