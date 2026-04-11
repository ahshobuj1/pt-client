'use client';

import { useAppSelector } from '@/redux/hooks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CandidateDashboard() {
  const exams = useAppSelector((state) => state.exam.exams);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Assessments</h1>
        <p className="text-muted-foreground mt-1">Select a test to begin your assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{exam.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {exam.duration} Minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Questions: {exam.questions.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Negative Marking: {exam.negativeMarking ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/candidate/exam/${exam.id}`} className="w-full">
                <Button className="w-full">Start Assessment</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <h3 className="text-xl font-medium">No active assessments</h3>
          <p className="text-muted-foreground mt-2">Check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
}
