import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/** Styled text input with optional label */
const TextInput = ({ label, className, id, ...props }: TextInputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input id={id} className={cn('input-base', className)} {...props} />
    </div>
  );
};

export default TextInput;
