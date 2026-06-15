export type Operator = '+' | '-' | '*' | '/' | '%' | '^';

export type FunctionName =
  | 'sin'
  | 'cos'
  | 'tan'
  | 'log'
  | 'ln'
  | 'sqrt'
  | 'pow'
  | 'root'
  | 'nthroot';

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
      kind: 'function';
      value: FunctionName;
      raw: string;
      position: number;
    }
  | {
      kind: 'comma';
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
  | 'UNKNOWN_FUNCTION'
  | 'UNEXPECTED_TOKEN'
  | 'MISSING_CLOSING_PAREN'
  | 'DIVIDE_BY_ZERO'
  | 'INVALID_ARGUMENTS'
  | 'DOMAIN_ERROR'
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
