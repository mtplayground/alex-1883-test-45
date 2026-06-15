import { evaluateTokens } from './parser';
import { tokenizeExpression } from './tokenizer';
import type { EvaluateResult } from './types';

export function evaluateExpression(expression: string): EvaluateResult {
  const tokenizeResult = tokenizeExpression(expression);

  if (!tokenizeResult.ok) {
    return tokenizeResult;
  }

  return evaluateTokens(tokenizeResult.value);
}
