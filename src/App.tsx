function App() {
  return (
    <main
      className="grid min-h-screen place-items-center px-6 py-8"
      aria-labelledby="app-title"
    >
      <section className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-10">
        <p className="mb-3 text-xs font-bold uppercase text-blue-600">
          React + Vite
        </p>
        <h1
          id="app-title"
          className="text-4xl font-bold leading-none text-slate-950 sm:text-6xl"
        >
          Calculator foundation
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          The app shell is ready for the calculator engine, reusable controls,
          and keypad modes in the upcoming implementation issues.
        </p>
      </section>
    </main>
  );
}

export default App;
