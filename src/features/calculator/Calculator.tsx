import { useReducer } from 'react';
import { Display } from '../../components';
import { evaluateExpression } from '../../engine';
import { BasicKeypad, type BasicOperator } from './keypads/BasicKeypad';
import { ScientificKeypad } from './keypads/ScientificKeypad';

interface CalculatorState {
  expression: string;
  result?: string;
  error?: string;
  hasEvaluated: boolean;
}

type CalculatorAction =
  | { type: 'digit'; value: string }
  | { type: 'decimal' }
  | { type: 'operator'; value: CalculatorOperator }
  | { type: 'insert'; value: string; continueFromResult?: boolean }
  | { type: 'clear' }
  | { type: 'delete' }
  | { type: 'evaluate' };

type CalculatorOperator = BasicOperator | '^';

const initialState: CalculatorState = {
  expression: '',
  hasEvaluated: false,
};

export function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <section
      className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 sm:p-5"
      aria-labelledby="calculator-title"
    >
      <h1
        id="calculator-title"
        className="mb-4 text-xl font-semibold leading-none text-slate-950"
      >
        Calculator
      </h1>
      <Display
        expression={state.expression}
        result={state.result}
        error={state.error}
      />
      <ScientificKeypad
        onInsert={(value) => dispatch({ type: 'insert', value })}
        onContinueFromResult={(value) =>
          dispatch({ type: 'insert', value, continueFromResult: true })
        }
        onPower={() => dispatch({ type: 'operator', value: '^' })}
      />
      <BasicKeypad
        onDigit={(value) => dispatch({ type: 'digit', value })}
        onDecimal={() => dispatch({ type: 'decimal' })}
        onOperator={(value) => dispatch({ type: 'operator', value })}
        onClear={() => dispatch({ type: 'clear' })}
        onDelete={() => dispatch({ type: 'delete' })}
        onEvaluate={() => dispatch({ type: 'evaluate' })}
      />
    </section>
  );
}

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'digit':
      return appendDigit(state, action.value);
    case 'decimal':
      return appendDecimal(state);
    case 'operator':
      return appendOperator(state, action.value);
    case 'insert':
      return appendText(state, action.value, action.continueFromResult);
    case 'clear':
      return initialState;
    case 'delete':
      return deleteLastInput(state);
    case 'evaluate':
      return evaluateCurrentExpression(state);
  }
}

function appendDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.hasEvaluated) {
    return {
      expression: digit,
      hasEvaluated: false,
    };
  }

  return {
    expression: `${state.expression}${digit}`,
    hasEvaluated: false,
  };
}

function appendDecimal(state: CalculatorState): CalculatorState {
  const expression = state.hasEvaluated && !state.error ? '' : state.expression;
  const currentNumber = getCurrentNumberFragment(expression);

  if (currentNumber.includes('.')) {
    return {
      ...state,
      hasEvaluated: false,
    };
  }

  const nextDecimal = currentNumber ? '.' : '0.';

  return {
    expression: `${expression}${nextDecimal}`,
    hasEvaluated: false,
  };
}

function appendOperator(
  state: CalculatorState,
  operator: CalculatorOperator,
): CalculatorState {
  const sourceExpression =
    state.hasEvaluated && state.result && !state.error
      ? state.result
      : state.expression;
  const trimmedExpression = sourceExpression.trim();

  if (!trimmedExpression) {
    if (operator !== '−') {
      return state;
    }

    return {
      expression: '−',
      hasEvaluated: false,
    };
  }

  const expressionWithoutTrailingOperator = hasTrailingOperator(
    trimmedExpression,
  )
    ? trimmedExpression.slice(0, -1).trimEnd()
    : trimmedExpression;

  return {
    expression: `${expressionWithoutTrailingOperator} ${operator} `,
    hasEvaluated: false,
  };
}

function appendText(
  state: CalculatorState,
  value: string,
  continueFromResult = false,
): CalculatorState {
  if (continueFromResult && !state.expression.trim() && !state.result) {
    return state;
  }

  if (state.hasEvaluated && !state.error) {
    return {
      expression:
        continueFromResult && state.result ? `${state.result}${value}` : value,
      hasEvaluated: false,
    };
  }

  return {
    expression: `${state.expression}${value}`,
    hasEvaluated: false,
  };
}

function deleteLastInput(state: CalculatorState): CalculatorState {
  if (state.hasEvaluated) {
    return {
      expression: state.expression,
      hasEvaluated: false,
    };
  }

  return {
    expression: state.expression.trimEnd().slice(0, -1).trimEnd(),
    hasEvaluated: false,
  };
}

function evaluateCurrentExpression(state: CalculatorState): CalculatorState {
  const expression = state.expression.trim();

  if (!expression) {
    return state;
  }

  const evaluation = evaluateExpression(expression);

  if (!evaluation.ok) {
    return {
      expression,
      error: evaluation.error.message,
      hasEvaluated: true,
    };
  }

  return {
    expression,
    result: formatNumber(evaluation.value),
    hasEvaluated: true,
  };
}

function getCurrentNumberFragment(expression: string): string {
  const match = expression.trimEnd().match(/(?:^|[+\-−×÷%^]\s*)([0-9.]+)$/);

  return match?.[1] ?? '';
}

function hasTrailingOperator(expression: string): boolean {
  return /[+−×÷%^]$/.test(expression);
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return Number.parseFloat(value.toPrecision(12)).toString();
}
