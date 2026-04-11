/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import AppButton from '@/components/ui/AppButton';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface MedicationItemProps {
  label: string;
  sublabel?: string;
  description?: string;
  prescribedBy?: string;
  timing: string;
  duration: string;
  timeOfDay?: string[];
}

const MedicationItem = ({
  label,
  sublabel,
  description,
  prescribedBy,
  timing,
  duration,
  timeOfDay = [],
}: MedicationItemProps) => {
  return (
    <div
      className={cn(
        'flex flex-col mt-2 sm:flex-row sm:items-center justify-between gap-4 p-4 min-h-[100px]',
        'rounded-lg border bg-background/50 hover:bg-background transition-colors',
      )}>
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <Label className="text-base font-medium leading-none">{label}</Label>
          {sublabel && (
            <span className="text-xs text-muted-foreground">({sublabel})</span>
          )}
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="text-sm whitespace-nowrap">
          <p className="font-medium">{timing}</p>
          <p className="text-xs text-muted-foreground">Duration: {duration}</p>
        </div>

        <div className="flex gap-2">
          {timeOfDay.map((time, i) => (
            <AppButton
              key={i}
              textColor="text-foreground hover:text-foreground/80"
              label={time}
              className="min-w-22.5 bg-secondary/40 hover:bg-secondary/40 text-xs sm:text-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationItem;
