import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('glass-dark rounded-2xl p-6 shadow-xl', className)}>
      {children}
    </div>
  );
}