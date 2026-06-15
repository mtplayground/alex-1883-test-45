import { CalcButton } from '../../../components';

interface ScientificKeypadProps {
  onInsert: (value: string) => void;
  onContinueFromResult: (value: string) => void;
  onPower: () => void;
}

export function ScientificKeypad({
  onInsert,
  onContinueFromResult,
  onPower,
}: ScientificKeypadProps) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-2" aria-label="Scientific keypad">
      <CalcButton
        label="sin"
        variant="function"
        aria-label="Sine"
        onClick={() => onInsert('sin(')}
      />
      <CalcButton
        label="cos"
        variant="function"
        aria-label="Cosine"
        onClick={() => onInsert('cos(')}
      />
      <CalcButton
        label="tan"
        variant="function"
        aria-label="Tangent"
        onClick={() => onInsert('tan(')}
      />
      <CalcButton
        label="("
        variant="function"
        aria-label="Open parenthesis"
        onClick={() => onInsert('(')}
      />

      <CalcButton
        label="log"
        variant="function"
        aria-label="Base ten logarithm"
        onClick={() => onInsert('log(')}
      />
      <CalcButton
        label="ln"
        variant="function"
        aria-label="Natural logarithm"
        onClick={() => onInsert('ln(')}
      />
      <CalcButton
        label="√"
        variant="function"
        aria-label="Square root"
        onClick={() => onInsert('sqrt(')}
      />
      <CalcButton
        label=")"
        variant="function"
        aria-label="Close parenthesis"
        onClick={() => onInsert(')')}
      />

      <CalcButton
        label="x²"
        variant="function"
        aria-label="Square"
        onClick={() => onContinueFromResult('^2')}
      />
      <CalcButton
        label="xʸ"
        variant="function"
        aria-label="Power"
        onClick={onPower}
      />
      <CalcButton
        label="ⁿ√"
        variant="function"
        aria-label="Nth root"
        onClick={() => onInsert('root(')}
      />
      <CalcButton
        label=","
        variant="function"
        aria-label="Argument separator"
        onClick={() => onInsert(',')}
      />
    </div>
  );
}
