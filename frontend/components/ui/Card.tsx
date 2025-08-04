import { classNames } from '@/../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={classNames('bg-white rounded-lg shadow-md p-6', className || '')}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

Card.Header = function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={classNames('mb-4', className || '')}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

Card.Title = function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={classNames('text-lg font-medium text-gray-800', className || '')}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

Card.Content = function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={className || ''}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

Card.Footer = function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={classNames('mt-4 pt-4 border-t border-gray-200', className || '')}>
      {children}
    </div>
  );
};