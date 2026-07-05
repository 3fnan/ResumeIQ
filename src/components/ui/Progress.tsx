import React from 'react';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  showLabel?: boolean;
  colorType?: 'dynamic' | 'primary' | 'success' | 'warning' | 'danger';
}

export function Progress({
  value,
  className = '',
  showLabel = false,
  colorType = 'dynamic',
}: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  // Determine color based on type or score severity
  const getColor = () => {
    if (colorType === 'dynamic') {
      if (clampedValue >= 80) return 'bg-success';
      if (clampedValue >= 60) return 'bg-warning';
      return 'bg-danger';
    }
    const colors = {
      primary: 'bg-primary',
      success: 'bg-color-success',
      warning: 'bg-color-warning',
      danger: 'bg-color-danger',
    };
    return colors[colorType];
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-sm font-medium">
          <span className="text-muted-foreground">Score</span>
          <span className="text-foreground">{clampedValue}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
