import type { EvaluateResult, FunctionName } from './types';

const functionArity: Record<FunctionName, number> = {
  sin: 1,
  cos: 1,
  tan: 1,
  log: 1,
  ln: 1,
  sqrt: 1,
  pow: 2,
  root: 2,
  nthroot: 2,
};

export function getFunctionArity(functionName: FunctionName): number {
  return functionArity[functionName];
}

export function applyFunction(
  functionName: FunctionName,
  args: number[],
): EvaluateResult {
  const expectedArity = getFunctionArity(functionName);

  if (args.length !== expectedArity) {
    return {
      ok: false,
      error: {
        code: 'INVALID_ARGUMENTS',
        message: `${functionName} expects ${expectedArity} argument${
          expectedArity === 1 ? '' : 's'
        }.`,
      },
    };
  }

  switch (functionName) {
    case 'sin':
      return finiteResult(Math.sin(args[0]), functionName);
    case 'cos':
      return finiteResult(Math.cos(args[0]), functionName);
    case 'tan':
      return finiteResult(Math.tan(args[0]), functionName);
    case 'log':
      return args[0] > 0
        ? finiteResult(Math.log10(args[0]), functionName)
        : domainError(
            functionName,
            'Logarithm input must be greater than zero.',
          );
    case 'ln':
      return args[0] > 0
        ? finiteResult(Math.log(args[0]), functionName)
        : domainError(
            functionName,
            'Natural log input must be greater than zero.',
          );
    case 'sqrt':
      return args[0] >= 0
        ? finiteResult(Math.sqrt(args[0]), functionName)
        : domainError(functionName, 'Square root input must not be negative.');
    case 'pow':
      return finiteResult(Math.pow(args[0], args[1]), functionName);
    case 'root':
    case 'nthroot':
      return applyNthRoot(args[0], args[1], functionName);
  }
}

function applyNthRoot(
  degree: number,
  radicand: number,
  functionName: FunctionName,
): EvaluateResult {
  if (!Number.isInteger(degree)) {
    return domainError(functionName, 'Root degree must be an integer.');
  }

  if (degree === 0) {
    return domainError(functionName, 'Root degree must not be zero.');
  }

  if (radicand < 0 && degree % 2 === 0) {
    return domainError(
      functionName,
      'Even root degree cannot be used with a negative radicand.',
    );
  }

  const magnitude = Math.pow(Math.abs(radicand), 1 / degree);
  const value = radicand < 0 ? -magnitude : magnitude;
  return finiteResult(value, functionName);
}

function finiteResult(
  value: number,
  functionName: FunctionName,
): EvaluateResult {
  if (!Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: 'NON_FINITE_RESULT',
        message: `${functionName} produced a non-finite result.`,
      },
    };
  }

  return { ok: true, value };
}

function domainError(
  functionName: FunctionName,
  message: string,
): EvaluateResult {
  return {
    ok: false,
    error: {
      code: 'DOMAIN_ERROR',
      message: `${functionName}: ${message}`,
    },
  };
}
