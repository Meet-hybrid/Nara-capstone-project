import { formatNaira, formatNairaShort } from '../../utils/formatCurrency';

test('formatNaira turns 300000 into naira symbol 300 comma 000', () => {
  expect(formatNaira(300000)).toBe('\u20A6300,000');
});

test('formatNaira handles zero', () => {
  expect(formatNaira(0)).toBe('\u20A60');
});

test('formatNaira handles thousands without commas for small numbers', () => {
  expect(formatNaira(500)).toBe('\u20A6500');
});

test('formatNairaShort turns 1800000 into naira 1 point 8 M', () => {
  expect(formatNairaShort(1800000)).toBe('\u20A61.8M');
});

test('formatNairaShort turns 300000 into naira 300K', () => {
  expect(formatNairaShort(300000)).toBe('\u20A6300K');
});

test('formatNairaShort returns full naira format for amounts below 1000', () => {
  expect(formatNairaShort(800)).toBe('\u20A6800');
});
