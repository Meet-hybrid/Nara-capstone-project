export const formatNaira = (amount) => {
  const num = Number(amount) || 0;
  return `\u20A6${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNairaShort = (amount) => {
  const num = Number(amount) || 0;
  if (num >= 1000000) {
    return `\u20A6${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `\u20A6${(num / 1000).toFixed(0)}K`;
  }
  return formatNaira(amount);
};

export const formatNairaCompact = (amount) => {
  const num = Number(amount) || 0;
  return `\u20A6${Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
