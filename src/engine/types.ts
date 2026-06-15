export type Operator = '+' | '-' | '*' | '/' | '%';

export type Token =
  | {
      kind: 'number';
      value: number;
      raw: string;
      position: number;
    }
  | {
      kind: 'operator';
      value: Operator;
      raw: string;
      position: number;
    }
  | {
      kind: 'leftParen' | 'rightParen';
      raw: string;
      position: number;
    };

export type EvaluationErrorCode =
  | 'EMPTY_EXPRESSION'
  | 'INVALID_CHARACTER'
  | 'INVALID_NUMBER'
  | 'UNEXPECTED_TOKEN'
  | 'MISSING_CLOSING_PAREN'
  | 'DIVIDE_BY_ZERO'
  | 'NON_FINITE_RESULT';

export interface EvaluationError {
  code: EvaluationErrorCode;
  message: string;
  position?: number;
}

export type Result<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: EvaluationError;
    };

export type TokenizeResult = Result<Token[]>;

export type EvaluateResult = Result<number>;
