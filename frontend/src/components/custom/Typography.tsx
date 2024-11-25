import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

const headingVariants = cva('font-heading scroll-m-20 tracking-tight', {
   variants: {
      color: {
         default: 'text-zinc-900 dark:text-zinc-50',
         muted: 'text-zinc-500 dark:text-zinc-400',
         primary: 'text-primary dark:text-primary-foreground',
         gradient:
            'bg-gradient-to-r from-rose-400 to-rose-500 text-transparent bg-clip-text dark:from-rose-600 dark:to-rose-700 ',
      },
   },
   defaultVariants: {
      color: 'default',
   },
});

interface H1Props extends VariantProps<typeof headingVariants> {
   children: ReactNode;
   className?: string;
}

export function H1({ children, color, className }: H1Props) {
   return (
      <h1
         className={cn(
            headingVariants({ color }),
            'mb-10 scroll-m-20 text-4xl font-bold transition-colors first:mt-0',
            className
         )}
      >
         {children}
      </h1>
   );
}

export function H2({ children, color, className }: H1Props) {
   return (
      <h2
         className={cn(
            headingVariants({ color }),
            'mb-10 scroll-m-20 text-3xl font-semibold transition-colors first:mt-0',
            className
         )}
      >
         {children}
      </h2>
   );
}

// Update H3 to use the variants
export function H3({ children, color, className }: H1Props) {
   return (
      <h3
         className={cn(
            headingVariants({ color }),
            'mb-8 scroll-m-20 text-2xl font-semibold',
            className
         )}
      >
         {children}
      </h3>
   );
}

// Update H4 to use the variants
export function H4({ children, color, className }: H1Props) {
   return (
      <h4
         className={cn(
            headingVariants({ color }),
            'mb-8 scroll-m-20 text-xl font-semibold',
            className
         )}
      >
         {children}
      </h4>
   );
}

export function P({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <p
         className={cn(
            'font-body text-zinc-900 dark:text-zinc-50 leading-7 [&:not(:first-child)]:mb-6',
            className
         )}
      >
         {children}
      </p>
   );
}

export function Blockquote({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <blockquote
         className={cn(
            'font-body text-zinc-900 dark:text-zinc-50 mb-6 border-l-2 pl-6 italic',
            className
         )}
      >
         {children}
      </blockquote>
   );
}

export function InlineCode({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <code
         className={cn(
            'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-zinc-900 dark:text-zinc-50 text-sm font-semibold',
            className
         )}
      >
         {children}
      </code>
   );
}

export function Lead({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <p
         className={cn(
            'font-body text-zinc-900 dark:text-zinc-50 text-sm text-muted-foreground',
            className
         )}
      >
         {children}
      </p>
   );
}

export function Large({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <p
         className={cn(
            'font-body text-lg font-semibold text-zinc-900 dark:text-zinc-50 ',
            className
         )}
      >
         {children}
      </p>
   );
}

export function Small({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <small
         className={cn(
            'font-body text-zinc-900 dark:text-zinc-50 text-sm font-medium leading-none',
            className
         )}
      >
         {children}
      </small>
   );
}

export function Subtle({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <p
         className={cn(
            'font-body text-zinc-900 dark:text-zinc-50 text-sm text-muted-foreground',
            className
         )}
      >
         {children}
      </p>
   );
}

export function List({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <ul
         className={cn(
            'font-body text-zinc-900 dark:text-zinc-50 my-6 ml-6 list-disc [&>li]:mb-2',
            className
         )}
      >
         {children}
      </ul>
   );
}
