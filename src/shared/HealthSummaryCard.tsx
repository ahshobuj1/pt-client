'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import { getHealthScoreColor } from '@/lib/getHealthScoreColor';
import { getVitalColor } from '@/lib/getVitalColor';

interface HealthSummaryProps {
  overallScore?: number;
  lastUpdated?: string;
  bloodPressure?: string;
  bloodGlucose?: string;
  weight?: string;
}

export default function HealthSummaryCard({
  overallScore = 0,
  lastUpdated = '1/14/2026',
  bloodPressure = '142/89 mmHg',
  bloodGlucose = '112 mg/dL',
  weight = '183 lbs',
}: HealthSummaryProps) {
  // Determine color based on score (simple example)
  const scoreColor = getHealthScoreColor(overallScore);

  return (
    <div className="space-y-6">
      {/* Health Summary Card */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Health Summary
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Health Score */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Overall Health Score
            </p>
            <p className={cn('text-5xl font-bold', scoreColor)}>
              {overallScore}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {lastUpdated}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Health Metrics */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Key Health Metrics (AI generated based on your Reports)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Blood Pressure */}
          <Card className="bg-muted/50 rounded-lg p-4 text-center border">
            <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
            <p className={cn("text-xl font-semibold", getVitalColor('bp', bloodPressure))}>
              {bloodPressure}
            </p>
          </Card>

          {/* Blood Glucose */}
          <Card className="bg-muted/50 rounded-lg p-4 text-center border">
            <p className="text-xs text-muted-foreground mb-1">Blood Glucose</p>
            <p className={cn("text-xl font-semibold", getVitalColor('glucose', bloodGlucose))}>
              {bloodGlucose}
            </p>
          </Card>

          {/* Weight */}
          <Card className="bg-muted/50 rounded-lg p-4 text-center border">
            <p className="text-xs text-muted-foreground mb-1">Weight</p>
            <p className={cn("text-xl font-semibold", getVitalColor('weight', weight))}>
              {weight}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
