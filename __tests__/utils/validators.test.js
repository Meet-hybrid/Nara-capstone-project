import { isValidNigerianPhone, isValidEmail, isStrongPassword } from '../../utils/validators';

test('nigerian phone validator accepts a number starting with 080', () => {
  expect(isValidNigerianPhone('08012345678')).toBe(true);
});

test('nigerian phone validator accepts a number starting with 070', () => {
  expect(isValidNigerianPhone('07098765432')).toBe(true);
});

test('nigerian phone validator accepts a number starting with 081', () => {
  expect(isValidNigerianPhone('08123456789')).toBe(true);
});

test('nigerian phone validator accepts a number starting with 090', () => {
  expect(isValidNigerianPhone('09012345678')).toBe(true);
});

test('nigerian phone validator accepts a number starting with 091', () => {
  expect(isValidNigerianPhone('09112345678')).toBe(true);
});

test('nigerian phone validator rejects a number starting with 01', () => {
  expect(isValidNigerianPhone('01123456789')).toBe(false);
});

test('nigerian phone validator rejects a number with fewer than 11 digits', () => {
  expect(isValidNigerianPhone('0801234567')).toBe(false);
});

test('nigerian phone validator rejects a number with letters', () => {
  expect(isValidNigerianPhone('080ABC12345')).toBe(false);
});

test('email validator accepts a valid email', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
});

test('email validator rejects an email without at symbol', () => {
  expect(isValidEmail('testexample.com')).toBe(false);
});

test('email validator rejects an empty string', () => {
  expect(isValidEmail('')).toBe(false);
});

test('password validator rejects passwords shorter than eight characters', () => {
  expect(isStrongPassword('Ab1')).toBe(false);
});

test('password validator rejects password without uppercase letter', () => {
  expect(isStrongPassword('abcdefgh1')).toBe(false);
});

test('password validator rejects password without number', () => {
  expect(isStrongPassword('Abcdefghi')).toBe(false);
});

test('password validator accepts a valid strong password', () => {
  expect(isStrongPassword('Abcdefg1')).toBe(true);
});
