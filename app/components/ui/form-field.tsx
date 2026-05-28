import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function FormField(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="glass-field h-14 w-full rounded-yealth px-5 font-body text-base outline-none transition-colors focus:border-yealth-gold/50 focus:ring-2 focus:ring-yealth-gold/30"
    />
  );
}

export function FormTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="glass-field h-[120px] w-full resize-none rounded-yealth px-5 py-4 font-body text-base outline-none transition-colors focus:border-yealth-gold/50 focus:ring-2 focus:ring-yealth-gold/30"
    />
  );
}
