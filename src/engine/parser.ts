import type { EvaluateResult, EvaluationError, Operator, Token } from './types';

export function evaluateTokens(tokens: Token[]): EvaluateResult {
  if (tokens.length === 0) {
    return {
      ok: false,
      error: {
        code: 'EMPTY_EXPRESSION',
        message: 'Enter an expression to evaluate.',
      },
    };
  }

  const parser = new Parser(tokens);
  const result = parser.parseExpression();

  if (!result.ok) {
    return result;
  }

  const trailingToken = parser.currentToken();
  if (trailingToken) {
    return {
      ok: false,
      error: {
        code: 'UNEXPECTED_TOKEN',
        message: `Unexpected token "${trailingToken.raw}".`,
        position: trailingToken.position,
      },
    };
  }

  if (!Number.isFinite(result.value)) {
    return {
      ok: false,
      error: {
        code: 'NON_FINITE_RESULT',
        message: 'The expression result is too large to display.',
      },
    };
  }

  return result;
}

class Parser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parseExpression(): EvaluateResult {
    return this.parseAdditive();
  }

  currentToken(): Token | undefined {
    return this.tokens[this.index];
  }

  private parseAdditive(): EvaluateResult {
    let left = this.parseMultiplicative();

    while (left.ok && this.isCurrentOperator(['+', '-'])) {
      const operator = this.consumeOperator();
      const right = this.parseMultiplicative();

      if (!right.ok) {
        return right;
      }

      left = applyOperator(left.value, operator, right.value);
    }

    return left;
  }

  private parseMultiplicative(): EvaluateResult {
    let left = this.parseUnary();

    while (left.ok && this.isCurrentOperator(['*', '/', '%'])) {
      const operator = this.consumeOperator();
      const right = this.parseUnary();

      if (!right.ok) {
        return right;
      }

      left = applyOperator(left.value, operator, right.value);
    }

    return left;
  }

  private parseUnary(): EvaluateResult {
    if (this.isCurrentOperator(['+', '-'])) {
      const operator = this.consumeOperator();
      const operand = this.parseUnary();

      if (!operand.ok) {
        return operand;
      }

      return {
        ok: true,
        value: operator === '-' ? -operand.value : operand.value,
      };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): EvaluateResult {
    const token = this.currentToken();

    if (!token) {
      return {
        ok: false,
        error: {
          code: 'UNEXPECTED_TOKEN',
          message: 'Expected a number or parenthesized expression.',
        },
      };
    }

    if (token.kind === 'number') {
      this.index += 1;
      return { ok: true, value: token.value };
    }

    if (token.kind === 'leftParen') {
      const openingPosition = token.position;
      this.index += 1;

      const result = this.parseExpression();
      if (!result.ok) {
        return result;
      }

      const closingToken = this.currentToken();
      if (!closingToken || closingToken.kind !== 'rightParen') {
        return {
          ok: false,
          error: {
            code: 'MISSING_CLOSING_PAREN',
            message: 'Missing closing parenthesis.',
            position: openingPosition,
          },
        };
      }

      this.index += 1;
      return result;
    }

    return {
      ok: false,
      error: unexpectedTokenError(token),
    };
  }

  private isCurrentOperator(operators: Operator[]): boolean {
    const token = this.currentToken();
    return token?.kind === 'operator' && operators.includes(token.value);
  }

  private consumeOperator(): Operator {
    const token = this.currentToken();

    if (!token || token.kind !== 'operator') {
      throw new Error('Parser invariant violated: expected operator token.');
    }

    this.index += 1;
    return token.value;
  }
}

function applyOperator(
  left: number,
  operator: Operator,
  right: number,
): EvaluateResult {
  if ((operator === '/' || operator === '%') && right === 0) {
    return {
      ok: false,
      error: {
        code: 'DIVIDE_BY_ZERO',
        message:
          operator === '/'
            ? 'Cannot divide by zero.'
            : 'Cannot modulo by zero.',
      },
    };
  }

  const value = calculate(left, operator, right);

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: 'NON_FINITE_RESULT',
        message: 'The expression result is too large to display.',
      },
    };
  }

  return { ok: true, value };
}

function calculate(left: number, operator: Operator, right: number): number {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
    case '%':
      return left % right;
  }
}

function unexpectedTokenError(token: Token): EvaluationError {
  return {
    code: 'UNEXPECTED_TOKEN',
    message: `Unexpected token "${token.raw}".`,
    position: token.position,
  };
}
