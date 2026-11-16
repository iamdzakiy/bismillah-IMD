import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'gold' | 'rainbow';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function GradientText({ 
  children, 
  variant = 'cyan',
  className,
  as: Component = 'span',
}: GradientTextProps) {
  // Solid accent colours. The animated multi-stop gradients were dropped.
  const variants = {
    cyan: 'text-agar',
    purple: 'text-agar',
    gold: 'text-agar',
    rainbow: 'text-agar',
  };

  return (
    <Component
      className={cn(
        variants[variant],
        className
      )}
    >
      {children}
    </Component>
  );
}