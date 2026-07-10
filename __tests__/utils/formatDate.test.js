import { formatMonthYear, formatRelativeTime } from '../../utils/formatDate';

test('formatMonthYear turns 2025-06 into June 2025', () => {
  expect(formatMonthYear('2025-06')).toBe('June 2025');
});

test('formatMonthYear turns 2026-01 into January 2026', () => {
  expect(formatMonthYear('2026-01')).toBe('January 2026');
});

test('formatRelativeTime returns Today for todays date', () => {
  const today = new Date();
  expect(formatRelativeTime(today.toISOString())).toBe('Today');
});

test('formatRelativeTime returns Yesterday for yesterdays date', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  expect(formatRelativeTime(yesterday.toISOString())).toBe('Yesterday');
});
