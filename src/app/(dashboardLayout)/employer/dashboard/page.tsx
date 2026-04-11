'use client';

import { useGetExamsQuery } from '@/redux/api/assessment.api';
import ExamCard from '@/components/employer/ExamCard';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function EmployerDashboardPage() {
  const { data: response, isLoading, isError } = useGetExamsQuery(undefined);
  const exams = response?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-6">
        <Card className="max-w-md border-rose-100 bg-rose-50/50">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500" />
            <h3 className="text-xl font-bold text-slate-900">Failed to load assessments</h3>
            <p className="text-slate-500">Something went wrong while fetching your assessments. Please try again later.</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider uppercase text-xs">
              <LayoutGrid size={14} />
              <span>Employer Overview</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Assessment Dashboard</h1>
            <p className="text-slate-500 text-lg max-w-2xl font-medium">Manage your online assessments, track candidate performance, and create new evaluation tests.</p>
          </div>
          <Link href="/employer/exams/new">
            <Button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3">
              <Plus size={20} strokeWidth={3} />
              <span>Create Assessment</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Your Assessments</h2>
          <div className="h-[2px] flex-1 bg-slate-100 rounded-full" />
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">{exams.length} Total</span>
        </div>

        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam: any) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 space-y-6">
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <Plus className="w-10 h-10 text-slate-300" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">No assessments found</h3>
              <p className="text-slate-500 max-w-sm">You haven&apos;t created any assessments yet. Get started by clicking the button above.</p>
            </div>
            <Link href="/employer/exams/new">
              <Button variant="outline" className="border-slate-200 text-slate-900 font-bold hover:bg-white shadow-sm">Create your first test</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
