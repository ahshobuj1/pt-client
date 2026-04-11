'use client';

import { useAppSelector } from '@/redux/hooks';
import ExamCard from '@/components/employer/ExamCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
  const exams = useAppSelector((state) => state.exam.exams);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your online assessments and view candidate performance.</p>
        </div>
        <Link href="/employer/create-test">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create New Test</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <h3 className="text-xl font-medium">No tests found</h3>
          <p className="text-muted-foreground mt-2">Get started by creating your first online assessment.</p>
          <Link href="/employer/create-test" className="mt-4 block">
            <Button variant="outline">Create Test</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
