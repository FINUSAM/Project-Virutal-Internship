// Input sanitization utilities
const crypto = require('crypto');

function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanEmail = email.trim().toLowerCase();
  
  return emailRegex.test(cleanEmail) ? cleanEmail : '';
}

function sanitizePhone(phone) {
  if (typeof phone !== 'string') {
    return '';
  }
  
  // Remove all non-digit characters except +, -, (, ), and spaces
  const cleanPhone = phone.replace(/[^\d+\-\(\)\s]/g, '');
  
  // Basic validation - should have at least 10 digits
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  return digitsOnly.length >= 10 ? cleanPhone : '';
}

function sanitizeCertificateId(id) {
  if (typeof id !== 'string') {
    return '';
  }
  
  // Allow format: XXX-YYYY-NNN
  const cleanId = id.trim().toUpperCase();
  const idRegex = /^[A-Z]{3}-\d{4}-\d{3}$/;
  
  return idRegex.test(cleanId) ? cleanId : '';
}

function sanitizeName(name) {
  if (typeof name !== 'string') {
    return '';
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  return name
    .trim()
    .replace(/[^a-zA-Z\s\-']/g, '')
    .substring(0, 100);
}

function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

function validateRequiredFields(data, requiredFields) {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      missing.push(field);
    }
  }
  
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
}

module.exports = {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeCertificateId,
  sanitizeName,
  generateSecureToken,
  validateRequiredFields
}; 