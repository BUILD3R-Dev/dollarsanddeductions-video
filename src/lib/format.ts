export type ValueFormat = 'currency' | 'percent' | 'number';

export type FormatOptions = {
  format?: ValueFormat;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Abbreviate thousands/millions: $107k, $1.2M. */
  compact?: boolean;
};

const group = (n: number, decimals: number) =>
  n.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});

export const formatValue = (value: number, opts: FormatOptions = {}) => {
  const {format = 'number', decimals = 0, prefix = '', suffix = '', compact = false} = opts;
  const abs = Math.abs(value);
  let body: string;
  if (compact && abs >= 1_000_000) body = `${group(abs / 1_000_000, 1)}M`;
  else if (compact && abs >= 1_000) body = `${group(abs / 1_000, abs >= 10_000 ? 0 : 1)}k`;
  else body = group(abs, decimals);

  const sign = value < 0 ? '−' : '';
  if (format === 'currency') body = `$${body}`;
  if (format === 'percent') body = `${body}%`;
  return `${prefix}${sign}${body}${suffix}`;
};
