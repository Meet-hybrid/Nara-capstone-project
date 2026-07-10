export const formatNaira = (amount) => {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `\u20A6${formatted}`;
};

export const formatNairaShort = (amount) => {
  if (amount >= 1000000) {
    return `\u20A6${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `\u20A6${(amount / 1000).toFixed(0)}K`;
  }
  return formatNaira(amount);
};
