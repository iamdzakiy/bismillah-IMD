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
  const variants = {
    cyan: 'from-bio-cyan via-bio-emerald to-bio-teal',
    purple: 'from-bio-purple via-bio-pink to-bio-cyan',
    gold: 'from-yellow-300 via-orange-400 to-pink-500',
    rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  };

  return (
    <Component
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient',
        variants[variant],
        className
      )}
    >
      {children}
    </Component>
  );
}