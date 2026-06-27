import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type CalcButtonVariant =
  | 'digit'
  | 'operator'
  | 'function'
  | 'control'
  | 'equals';

export type CalcButtonSize = 'default' | 'wide' | 'tall';

export interface CalcButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  label: ReactNode;
  variant?: CalcButtonVariant;
  size?: CalcButtonSize;
  isActive?: boolean;
}

const baseClasses =
  'inline-flex min-h-14 select-none items-center justify-center rounded-lg border px-3 text-lg font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50';

const variantClasses: Record<CalcButtonVariant, string> = {
  digit:
    'border-slate-700 bg-slate-800 text-slate-50 hover:border-slate-600 hover:bg-slate-700',
  operator:
    'border-cyan-500 bg-cyan-600 text-slate-950 hover:border-cyan-400 hover:bg-cyan-500',
  function:
    'border-violet-500/70 bg-violet-950 text-violet-100 hover:border-violet-400 hover:bg-violet-900',
  control:
    'border-amber-500/80 bg-amber-950 text-amber-100 hover:border-amber-400 hover:bg-amber-900',
  equals:
    'border-emerald-500 bg-emerald-600 text-slate-950 hover:border-emerald-400 hover:bg-emerald-500',
};

const sizeClasses: Record<CalcButtonSize, string> = {
  default: 'aspect-square',
  wide: 'col-span-2 min-h-14',
  tall: 'row-span-2 min-h-32',
};

export function CalcButton({
  label,
  variant = 'digit',
  size = 'default',
  isActive = false,
  type = 'button',
  className,
  ...buttonProps
}: CalcButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      className={joinClasses(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isActive
          ? 'ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950'
          : undefined,
        className,
      )}
    >
      {label}
    </button>
  );
}

function joinClasses(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}
