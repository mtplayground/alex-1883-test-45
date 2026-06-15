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
  'inline-flex min-h-14 select-none items-center justify-center rounded-lg border px-3 text-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const variantClasses: Record<CalcButtonVariant, string> = {
  digit: 'border-slate-200 bg-white text-slate-950 hover:bg-slate-50',
  operator: 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700',
  function: 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200',
  control: 'border-amber-500 bg-amber-100 text-amber-950 hover:bg-amber-200',
  equals: 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700',
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
        isActive ? 'ring-2 ring-blue-500 ring-offset-2' : undefined,
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
