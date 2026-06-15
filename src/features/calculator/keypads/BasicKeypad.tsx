import { CalcButton } from '../../../components';

export type BasicOperator = '+' | '−' | '×' | '÷' | '%';

interface BasicKeypadProps {
  onDigit: (value: string) => void;
  onDecimal: () => void;
  onOperator: (value: BasicOperator) => void;
  onClear: () => void;
  onDelete: () => void;
  onEvaluate: () => void;
}

export function BasicKeypad({
  onDigit,
  onDecimal,
  onOperator,
  onClear,
  onDelete,
  onEvaluate,
}: BasicKeypadProps) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-2" aria-label="Basic keypad">
      <CalcButton
        label="C"
        variant="control"
        aria-label="Clear"
        onClick={onClear}
      />
      <CalcButton
        label="DEL"
        variant="control"
        aria-label="Delete"
        onClick={onDelete}
      />
      <CalcButton
        label="%"
        variant="operator"
        aria-label="Modulo"
        onClick={() => onOperator('%')}
      />
      <CalcButton
        label="÷"
        variant="operator"
        aria-label="Divide"
        onClick={() => onOperator('÷')}
      />

      <DigitButton value="7" onDigit={onDigit} />
      <DigitButton value="8" onDigit={onDigit} />
      <DigitButton value="9" onDigit={onDigit} />
      <CalcButton
        label="×"
        variant="operator"
        aria-label="Multiply"
        onClick={() => onOperator('×')}
      />

      <DigitButton value="4" onDigit={onDigit} />
      <DigitButton value="5" onDigit={onDigit} />
      <DigitButton value="6" onDigit={onDigit} />
      <CalcButton
        label="−"
        variant="operator"
        aria-label="Subtract"
        onClick={() => onOperator('−')}
      />

      <DigitButton value="1" onDigit={onDigit} />
      <DigitButton value="2" onDigit={onDigit} />
      <DigitButton value="3" onDigit={onDigit} />
      <CalcButton
        label="+"
        variant="operator"
        aria-label="Add"
        onClick={() => onOperator('+')}
      />

      <CalcButton
        label="0"
        size="wide"
        aria-label="Digit 0"
        onClick={() => onDigit('0')}
      />
      <CalcButton label="." aria-label="Decimal point" onClick={onDecimal} />
      <CalcButton
        label="="
        variant="equals"
        aria-label="Evaluate"
        onClick={onEvaluate}
      />
    </div>
  );
}

function DigitButton({
  value,
  onDigit,
}: {
  value: string;
  onDigit: (value: string) => void;
}) {
  return (
    <CalcButton
      label={value}
      aria-label={`Digit ${value}`}
      onClick={() => onDigit(value)}
    />
  );
}
