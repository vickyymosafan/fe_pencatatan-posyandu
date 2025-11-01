/**
 * Validation Utilities
 * Reusable validation functions for form inputs
 * Pure functions that return validation results
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validateEmail('user@example.com');
 * if (!result.isValid) console.log(result.error);
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return {
      isValid: false,
      error: 'Email wajib diisi',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'Format email tidak valid',
    };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 * Requirements: minimum 8 characters, contains letters and numbers
 * @param password - Password string to validate
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validatePassword('Pass1234');
 * if (!result.isValid) console.log(result.error);
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || !password.trim()) {
    return {
      isValid: false,
      error: 'Password wajib diisi',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password minimal 8 karakter',
    };
  }

  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: 'Password harus mengandung huruf dan angka',
    };
  }

  return { isValid: true };
}

/**
 * Validate NIK (Nomor Induk Kependudukan)
 * Requirements: exactly 16 numeric digits
 * @param nik - NIK string to validate
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validateNIK('1234567890123456');
 * if (!result.isValid) console.log(result.error);
 */
export function validateNIK(nik: string): ValidationResult {
  if (!nik || !nik.trim()) {
    return {
      isValid: false,
      error: 'NIK wajib diisi',
    };
  }

  const nikTrimmed = nik.trim();

  // Check if exactly 16 characters
  if (nikTrimmed.length !== 16) {
    return {
      isValid: false,
      error: 'NIK harus 16 digit',
    };
  }

  // Check if all characters are numeric
  if (!/^\d{16}$/.test(nikTrimmed)) {
    return {
      isValid: false,
      error: 'NIK harus berupa angka',
    };
  }

  return { isValid: true };
}

/**
 * Validate date is not in the future
 * @param date - Date string or Date object to validate
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validateDateNotFuture('2024-12-31');
 * if (!result.isValid) console.log(result.error);
 */
export function validateDateNotFuture(date: string | Date): ValidationResult {
  if (!date) {
    return {
      isValid: false,
      error: 'Tanggal wajib diisi',
    };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      error: 'Format tanggal tidak valid',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  if (dateObj > today) {
    return {
      isValid: false,
      error: 'Tanggal tidak boleh di masa depan',
    };
  }

  return { isValid: true };
}

/**
 * Validate required field (non-empty string)
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validateRequired(name, 'Nama');
 * if (!result.isValid) console.log(result.error);
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: `${fieldName} wajib diisi`,
    };
  }

  return { isValid: true };
}

/**
 * Validate positive number
 * @param value - Value to validate (string or number)
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validatePositiveNumber('50', 'Berat Badan');
 * if (!result.isValid) console.log(result.error);
 */
export function validatePositiveNumber(
  value: string | number,
  fieldName: string
): ValidationResult {
  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      error: `${fieldName} wajib diisi`,
    };
  }

  const numValue = typeof value === 'string' ? Number(value) : value;

  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: `${fieldName} harus berupa angka`,
    };
  }

  if (numValue <= 0) {
    return {
      isValid: false,
      error: `${fieldName} harus lebih dari 0`,
    };
  }

  return { isValid: true };
}

/**
 * Validate minimum length
 * @param value - String value to validate
 * @param minLength - Minimum required length
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validateMinLength(password, 8, 'Password');
 * if (!result.isValid) console.log(result.error);
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): ValidationResult {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: `${fieldName} wajib diisi`,
    };
  }

  if (value.trim().length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} minimal ${minLength} karakter`,
    };
  }

  return { isValid: true };
}

/**
 * Validate maximum length
 * @param value - String value to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validateMaxLength(description, 500, 'Deskripsi');
 * if (!result.isValid) console.log(result.error);
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationResult {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} maksimal ${maxLength} karakter`,
    };
  }

  return { isValid: true };
}

/**
 * Validate phone number (Indonesian format)
 * @param phone - Phone number string to validate
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validatePhoneNumber('081234567890');
 * if (!result.isValid) console.log(result.error);
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      error: 'Nomor telepon wajib diisi',
    };
  }

  const phoneTrimmed = phone.trim();

  // Indonesian phone number: starts with 0 or +62, 10-13 digits
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;

  if (!phoneRegex.test(phoneTrimmed)) {
    return {
      isValid: false,
      error: 'Format nomor telepon tidak valid',
    };
  }

  return { isValid: true };
}

/**
 * Validate age range
 * @param birthDate - Birth date string or Date object
 * @param minAge - Minimum age requirement
 * @param maxAge - Maximum age requirement (optional)
 * @returns ValidationResult with isValid and optional error message
 * 
 * @example
 * const result = validateAgeRange('1950-01-01', 60, 100);
 * if (!result.isValid) console.log(result.error);
 */
export function validateAgeRange(
  birthDate: string | Date,
  minAge: number,
  maxAge?: number
): ValidationResult {
  if (!birthDate) {
    return {
      isValid: false,
      error: 'Tanggal lahir wajib diisi',
    };
  }

  const dateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      error: 'Format tanggal lahir tidak valid',
    };
  }

  const today = new Date();
  let age = today.getFullYear() - dateObj.getFullYear();
  const monthDiff = today.getMonth() - dateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateObj.getDate())) {
    age--;
  }

  if (age < minAge) {
    return {
      isValid: false,
      error: `Umur minimal ${minAge} tahun`,
    };
  }

  if (maxAge && age > maxAge) {
    return {
      isValid: false,
      error: `Umur maksimal ${maxAge} tahun`,
    };
  }

  return { isValid: true };
}

/**
 * Helper function to get first error from multiple validation results
 * @param results - Array of validation results
 * @returns First error message found, or undefined if all valid
 * 
 * @example
 * const errors = getFirstError([
 *   validateEmail(email),
 *   validatePassword(password)
 * ]);
 * if (errors) console.log(errors);
 */
export function getFirstError(results: ValidationResult[]): string | undefined {
  const firstInvalid = results.find((result) => !result.isValid);
  return firstInvalid?.error;
}

/**
 * Helper function to collect all errors from multiple validation results
 * @param results - Array of validation results
 * @returns Array of error messages
 * 
 * @example
 * const errors = getAllErrors([
 *   validateEmail(email),
 *   validatePassword(password)
 * ]);
 * errors.forEach(error => console.log(error));
 */
export function getAllErrors(results: ValidationResult[]): string[] {
  return results.filter((result) => !result.isValid).map((result) => result.error!);
}

/**
 * Helper function to check if all validations passed
 * @param results - Array of validation results
 * @returns True if all validations passed
 * 
 * @example
 * const isValid = isAllValid([
 *   validateEmail(email),
 *   validatePassword(password)
 * ]);
 * if (isValid) submitForm();
 */
export function isAllValid(results: ValidationResult[]): boolean {
  return results.every((result) => result.isValid);
}
