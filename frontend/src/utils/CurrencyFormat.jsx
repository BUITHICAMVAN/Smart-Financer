export const USConverter = (amount, locale = 'en-US', currency = 'USD') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

export const VNDConverter = (amount, locale = 'vi-VN', currency = 'VND') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export const EURConverter = (amount, locale = 'de-DE', currency = 'EUR') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}