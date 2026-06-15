export interface DisplayProps {
  expression: string;
  result?: string;
  error?: string;
  expressionLabel?: string;
  resultLabel?: string;
}

export function Display({
  expression,
  result,
  error,
  expressionLabel = 'Expression',
  resultLabel = 'Result',
}: DisplayProps) {
  const visibleExpression = expression.trim() ? expression : '0';
  const visibleResult = error ?? result ?? '0';

  return (
    <section
      className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-right shadow-inner"
      aria-label="Calculator display"
    >
      <div className="min-h-8">
        <p className="sr-only">{expressionLabel}</p>
        <p className="break-all font-mono text-sm leading-6 text-slate-300">
          {visibleExpression}
        </p>
      </div>
      <div className="mt-3 min-h-12" aria-live="polite" aria-atomic="true">
        <p className="sr-only">{error ? 'Error' : resultLabel}</p>
        <p
          className={
            error
              ? 'break-words font-mono text-xl font-semibold leading-tight text-rose-300'
              : 'min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-4xl font-semibold leading-tight text-white tabular-nums'
          }
          role={error ? 'alert' : undefined}
          title={visibleResult}
        >
          {visibleResult}
        </p>
      </div>
    </section>
  );
}
