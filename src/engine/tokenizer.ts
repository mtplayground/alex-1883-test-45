import type {
  FunctionName,
  Operator,
  Result,
  Token,
  TokenizeResult,
} from './types';

const operatorMap = new Map<string, Operator>([
  ['+', '+'],
  ['-', '-'],
  ['−', '-'],
  ['*', '*'],
  ['×', '*'],
  ['/', '/'],
  ['÷', '/'],
  ['%', '%'],
  ['^', '^'],
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

    if (char === ',') {
      tokens.push({ kind: 'comma', raw: char, position: index });
      index += 1;
      continue;
    }

    if (expression.startsWith('**', index)) {
      tokens.push({
        kind: 'operator',
        value: '^',
        raw: '**',
        position: index,
      });
      index += 2;
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

    if (char === '√') {
      tokens.push({
        kind: 'function',
        value: 'sqrt',
        raw: char,
        position: index,
      });
      index += 1;
      continue;
    }

    if (isIdentifierStart(char)) {
      const functionResult = readFunction(expression, index);

      if (!functionResult.ok) {
        return functionResult;
      }

      tokens.push(functionResult.value.token);
      index = functionResult.value.nextIndex;
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

function readFunction(
  expression: string,
  start: number,
): Result<{ token: Token; nextIndex: number }> {
  let index = start;

  while (index < expression.length && isIdentifierPart(expression[index])) {
    index += 1;
  }

  const raw = expression.slice(start, index);
  const normalized = raw.toLowerCase();

  if (!isFunctionName(normalized)) {
    return {
      ok: false,
      error: {
        code: 'UNKNOWN_FUNCTION',
        message: `Unknown function "${raw}".`,
        position: start,
      },
    };
  }

  return {
    ok: true,
    value: {
      token: {
        kind: 'function',
        value: normalized,
        raw,
        position: start,
      },
      nextIndex: index,
    },
  };
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

function isIdentifierStart(value: string): boolean {
  return /[A-Za-z]/.test(value);
}

function isIdentifierPart(value: string): boolean {
  return /[A-Za-z]/.test(value);
}

function isFunctionName(value: string): value is FunctionName {
  return [
    'sin',
    'cos',
    'tan',
    'log',
    'ln',
    'sqrt',
    'pow',
    'root',
    'nthroot',
  ].includes(value);
}

function isWhitespace(value: string): boolean {
  return /\s/.test(value);
}
