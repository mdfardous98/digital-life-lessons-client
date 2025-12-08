export const validatePassword = (pass) => {
  return /[A-Z]/.test(pass) && /[a-z]/.test(pass) && pass.length >= 6;
};
