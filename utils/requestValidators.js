const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parsePositiveInteger = value => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

exports.getPagination = query => {
  const page = parsePositiveInteger(query.page ?? 1);
  const limit = parsePositiveInteger(query.limit ?? 5);

  if (!page || !limit) {
    return {
      error: 'Page and limit must be positive integers'
    };
  }

  return { page, limit };
};

exports.isValidDateInput = value => {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return false;
  }

  const date = new Date(`${trimmed}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === trimmed;
};

exports.validateDateRange = (fromDate, toDate) => {
  if (!exports.isValidDateInput(fromDate) || !exports.isValidDateInput(toDate)) {
    return 'fromDate and toDate must be valid dates in YYYY-MM-DD format';
  }

  if (fromDate > toDate) {
    return 'fromDate cannot be later than toDate';
  }

  return null;
};

exports.isValidEmail = email => emailPattern.test(String(email).trim().toLowerCase());
exports.parsePositiveInteger = parsePositiveInteger;
