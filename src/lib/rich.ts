/**
 * Tiny rich-text parser shared by text scenes.
 *   *word*      → emphasis (italic serif in the accent colour); may span several words
 *   $120,000    → money token (auto count-up in KineticType)
 */
export type MoneyToken = {value: number; decimals: number; before: string; after: string};

export type Word = {text: string; emphasis: boolean; money: MoneyToken | null};

const MONEY = /^([^\d$−-]*)([−-]?)\$([\d,]+(?:\.\d+)?)(.*)$/;

export const parseMoney = (word: string): MoneyToken | null => {
  const m = word.match(MONEY);
  if (!m) return null;
  const [, before, sign, digits, after] = m;
  if (/\d/.test(after)) return null;
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
  const value = Number(digits.replace(/,/g, '')) * (sign ? -1 : 1);
  return {value, decimals, before, after};
};

export const parseRich = (text: string): Word[] => {
  const out: Word[] = [];
  let inEmphasis = false;
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let word = raw;
    let emphasis = inEmphasis;
    if (word.startsWith('*')) {
      emphasis = true;
      inEmphasis = true;
      word = word.slice(1);
    }
    if (word.includes('*')) {
      inEmphasis = false;
      word = word.replace(/\*/g, '');
    }
    out.push({text: word, emphasis, money: parseMoney(word)});
  }
  return out;
};

export const plainText = (text: string) => text.replace(/\*/g, '');
