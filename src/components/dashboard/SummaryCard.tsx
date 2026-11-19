import React, { type ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  amount: string;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor: string;
  accentColor?: string;
  onClick?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  subtitle,
  icon,
  iconBgColor,
  accentColor = 'border-finora-border',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-card p-5 border border-finora-border shadow-soft transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-soft-lg hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-medium text-finora-textSecondary tracking-wide">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-finora-textPrimary">
          {amount}
        </h3>
        {subtitle && (
          <p className="text-xs text-finora-textSecondary flex items-center gap-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`mt-3 h-1 w-full rounded-full ${accentColor}`} />
    </div>
  );
};
