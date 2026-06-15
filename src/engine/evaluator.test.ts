import { describe, expect, it } from 'vitest';
import { evaluateExpression } from './evaluator';
import type { EvaluationErrorCode } from './types';

describe('evaluateExpression', () => {
  it('applies arithmetic precedence across supported operators', () => {
    expectValue('2 + 3 * 4', 14);
    expectValue('2 × 3 + 8 ÷ 4', 8);
    expectValue('20 % 6 + 1', 3);
    expectValue('-2^2', -4);
  });

  it('evaluates nested parenthesized expressions before surrounding operators', () => {
    expectValue('(2 + 3) * 4', 20);
    expectValue('2 * (3 + (4 - 1))', 12);
    expectValue('((10 - 4) / 3) + 7', 9);
  });

  it('evaluates powers and exponent aliases', () => {
    expectValue('2^3^2', 512);
    expectValue('2**3', 8);
    expectValue('pow(2, 5)', 32);
  });

  it('evaluates scientific functions', () => {
    expectValue('sin(0)', 0);
    expectValue('cos(0)', 1);
    expectValue('tan(0)', 0);
    expectValue('log(1000)', 3);
    expectValue('ln(2.718281828459045)', 1);
  });

  it('evaluates square and nth roots', () => {
    expectValue('sqrt(81)', 9);
    expectValue('√(16)', 4);
    expectValue('root(3, 27)', 3);
    expectValue('nthroot(3, -8)', -2);
  });

  it('returns structured errors for divide-by-zero cases', () => {
    expectError('1 / 0', 'DIVIDE_BY_ZERO');
    expectError('10 % 0', 'DIVIDE_BY_ZERO');
  });

  it('returns structured errors for malformed input', () => {
    expectError('', 'EMPTY_EXPRESSION');
    expectError('1 +', 'UNEXPECTED_TOKEN');
    expectError('(1 + 2', 'MISSING_CLOSING_PAREN');
    expectError('1..2', 'INVALID_NUMBER');
    expectError('asin(1)', 'UNKNOWN_FUNCTION');
  });

  it('returns structured errors for scientific domain and result failures', () => {
    expectError('sqrt(-1)', 'DOMAIN_ERROR');
    expectError('log(0)', 'DOMAIN_ERROR');
    expectError('root(0, 8)', 'DOMAIN_ERROR');
    expectError('pow(10, 9999)', 'NON_FINITE_RESULT');
  });
});

function expectValue(expression: string, expected: number): void {
  const result = evaluateExpression(expression);

  if (!result.ok) {
    throw new Error(
      `Expected "${expression}" to evaluate, got ${result.error.code}: ${result.error.message}`,
    );
  }

  expect(result.value).toBeCloseTo(expected, 10);
}

function expectError(
  expression: string,
  expectedCode: EvaluationErrorCode,
): void {
  const result = evaluateExpression(expression);

  if (result.ok) {
    throw new Error(
      `Expected "${expression}" to fail with ${expectedCode}, got ${result.value}`,
    );
  }

  expect(result.error.code).toBe(expectedCode);
}
