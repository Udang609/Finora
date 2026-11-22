import React, { type ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center card card-hover">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-finora-lightBlue text-finora-primary flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h4 className="text-base sm:text-lg font-semibold text-finora-textPrimary mb-1">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-finora-textSecondary max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction} leftIcon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
};