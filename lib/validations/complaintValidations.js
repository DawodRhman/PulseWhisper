// Validation utilities for complaint and new connection forms

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return "Name is required";
  }
  if (name.length > 25) {
    return "Name must be 25 characters or less";
  }
  return "";
};

export const validatePhone = (phone) => {
  if (!phone || phone.trim().length === 0) {
    return "Phone number is required";
  }
  
  // Patterns:
  // 021-12345678 (landline with area code and dash)
  // +92-21-12345678 (international format with area code and dashes)
  // 0XXX-1234567 (mobile with area code and dash)
  // +92-XXX-12345678 (international mobile with dashes)
  
  const patterns = [
    /^0\d{2,3}-\d{7,8}$/,           // 021-12345678 or 0XXX-1234567
    /^\+92-\d{2,3}-\d{7,8}$/,       // +92-21-12345678 or +92-XXX-12345678
  ];
  
  const isValid = patterns.some(pattern => pattern.test(phone.trim()));
  
  if (!isValid) {
    return "Phone number must be in format: 021-12345678, +92-21-12345678, 0XXX-1234567, or +92-XXX-12345678";
  }
  
  return "";
};

export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return ""; // Email is optional
  }
  
  if (!email.includes("@") || !email.includes(".com")) {
    return "Email must include @ and .com";
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  return "";
};

export const validateAddress = (address) => {
  if (!address || address.trim().length === 0) {
    return ""; // Address is optional but recommended
  }
  if (address.length > 500) {
    return "Address must be 500 characters or less";
  }
  return "";
};

export const validateLandmark = (landmark) => {
  if (!landmark || landmark.trim().length === 0) {
    return "Nearest landmark is required";
  }
  
  const length = landmark.trim().length;
  if (length < 15 || length > 20) {
    return "Nearest landmark must be between 15 and 20 characters";
  }
  
  return "";
};

export const validateDescription = (description) => {
  if (!description || description.trim().length === 0) {
    return "Description is required";
  }
  
  // Count words (split by whitespace)
  const words = description.trim().split(/\s+/).filter(word => word.length > 0);
  
  if (words.length > 250) {
    return "Description must be 250 words or less";
  }
  
  if (description.length > 350) {
    return "Description must be 350 characters or less";
  }
  
  return "";
};

export const validateImage = (file) => {
  if (!file) {
    return ""; // Image is optional
  }
  
  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, JPEG, and PNG images are allowed";
  }
  
  // Check file size (5MB = 5 * 1024 * 1024 bytes)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return "Image size must be 5MB or less";
  }
  
  return "";
};

export const validateCNIC = (cnic) => {
  if (!cnic || cnic.trim().length === 0) {
    return "CNIC is required";
  }
  
  // Remove dashes for validation
  const cleanCNIC = cnic.replace(/-/g, "");
  
  // CNIC should be 13 digits in format XXXXX-XXXXXXX-X
  if (!/^\d{13}$/.test(cleanCNIC)) {
    return "CNIC must be 13 digits in format XXXXX-XXXXXXX-X";
  }
  
  // Check format with dashes
  if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic.trim())) {
    return "CNIC must be in format XXXXX-XXXXXXX-X";
  }
  
  return "";
};

export const validateConsumerNumber = (consumerNum) => {
  // Consumer number is optional, so no validation needed
  return "";
};

