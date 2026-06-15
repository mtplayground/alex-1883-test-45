import type { Operator, Result, Token, TokenizeResult } from './types';

const operatorMap = new Map<string, Operator>([
  ['+', '+'],
  ['-', '-'],
  ['−', '-'],
  ['*', '*'],
  ['×', '*'],
  ['/', '/'],
  ['÷', '/'],
  ['%', '%'],
]);

export function tokenizeExpression(expression: string): TokenizeResult {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression[index];

    if (isWhitespace(char)) {
      index += 1;
      continue;
    }

    if (char === '(') {
      tokens.push({ kind: 'leftParen', raw: char, position: index });
      index += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({ kind: 'rightParen', raw: char, position: index });
      index += 1;
      continue;
    }

    const operator = operatorMap.get(char);
    if (operator) {
      tokens.push({
        kind: 'operator',
        value: operator,
        raw: char,
        position: index,
      });
      index += 1;
      continue;
    }

    if (isDigit(char) || char === '.') {
      const numberStart = index;
      const numberResult = readNumber(expression, numberStart);

      if (!numberResult.ok) {
        return numberResult;
      }

      tokens.push(numberResult.value.token);
      index = numberResult.value.nextIndex;
      continue;
    }

    return {
      ok: false,
      error: {
        code: 'INVALID_CHARACTER',
        message: `Invalid character "${char}" in expression.`,
        position: index,
      },
    };
  }

  return { ok: true, value: tokens };
}

function readNumber(
  expression: string,
  start: number,
): Result<{ token: Token; nextIndex: number }> {
  let index = start;
  let hasDigit = false;
  let hasDecimal = false;

  while (index < expression.length) {
    const char = expression[index];

    if (isDigit(char)) {
      hasDigit = true;
      index += 1;
      continue;
    }

    if (char === '.') {
      if (hasDecimal) {
        return {
          ok: false,
          error: {
            code: 'INVALID_NUMBER',
            message: 'A number can contain only one decimal point.',
            position: index,
          },
        };
      }

      hasDecimal = true;
      index += 1;
      continue;
    }

    break;
  }

  const raw = expression.slice(start, index);
  const value = Number(raw);

  if (!hasDigit || !Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: 'INVALID_NUMBER',
        message: `Invalid number "${raw}".`,
        position: start,
      },
    };
  }

  return {
    ok: true,
    value: {
      token: {
        kind: 'number',
        value,
        raw,
        position: start,
      },
      nextIndex: index,
    },
  };
}

function isDigit(value: string): boolean {
  return value >= '0' && value <= '9';
}

function isWhitespace(value: string): boolean {
  return /\s/.test(value);
}
