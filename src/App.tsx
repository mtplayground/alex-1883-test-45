import { CalcButton, Display } from './components';

const previewButtons = [
  { label: 'C', variant: 'control' },
  { label: '7', variant: 'digit' },
  { label: '÷', variant: 'operator' },
  { label: 'sin', variant: 'function' },
  { label: '8', variant: 'digit' },
  { label: '=', variant: 'equals' },
] as const;

function App() {
  return (
    <main
      className="grid min-h-screen place-items-center bg-slate-100 px-6 py-8"
      aria-labelledby="app-title"
    >
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 sm:p-5">
        <h1
          id="app-title"
          className="mb-4 text-xl font-semibold leading-none text-slate-950"
        >
          Calculator
        </h1>
        <Display expression="12 × (3 + 4)" result="84" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {previewButtons.map((button) => (
            <CalcButton
              key={button.label}
              label={button.label}
              variant={button.variant}
              aria-label={`${button.label} key`}
              disabled
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
